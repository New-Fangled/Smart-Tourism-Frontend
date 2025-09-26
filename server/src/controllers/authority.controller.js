import { Destination } from "../models/destination.model.js";
import {Permit} from "../models/permit.model.js"
import mongoose from 'mongoose';
import Qrcode from "qrcode";

const userDashboard = async (req,res) => {
    try {
        const totalPermits = await Permit.countDocuments();
        const activeVisitors = await Permit.countDocuments({ status: "valid", entered: true });
        const pendingRequests = await Permit.countDocuments({ status: "pending" });

        const ecoTaxAgg = await Permit.aggregate([
      { $group: { _id: null, totalEcoTax: { $sum: "$ecoTax" } } }
    ]);

    const ecoTaxTotal = ecoTaxAgg[0]?.totalEcoTax || 0;

    // Get pending permits list with user details and booking info
    const pendingPermitsList = await Permit.find({ status: "pending" })
      .populate('userId', 'name email')
      .populate('destination', 'name location')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get destinations with basic info
    const destinations = await Destination.find({})
      .select('name location capacity bookedNo status')
      .limit(20);

    return res.json({
        totalPermits,
        activeVisitors,
        ecoTaxTotal,
        pendingRequests,
        pendingPermitsList: pendingPermitsList.map(permit => ({
          _id: permit._id,
          userId: permit.userId?._id,
          userName: permit.userId?.name || permit.guestName || 'Unknown',
          userEmail: permit.userId?.email || permit.guestEmail,
          guestPhone: permit.guestPhone,
          destination: permit.destination?.name || 'Unknown',
          destinationId: permit.destination?._id,
          checkInDate: permit.check_in_date,
          checkOutDate: permit.check_out_date,
          date: permit.date, // Keep for backward compatibility
          status: permit.status,
          ecoTax: permit.ecoTax,
          bookingId: permit.bookingId, // Link to original booking
          createdAt: permit.createdAt,
          isFromBooking: !!permit.bookingId // Flag to identify booking-generated permits
        })),
        destinations: destinations.map(dest => ({
          _id: dest._id,
          name: dest.name,
          location: dest.location,
          maxCapacity: dest.capacity,
          currentCapacity: dest.bookedNo || 0,
          status: dest.status
        }))
    })
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            error: "failed to load authority dashboard"
        })
    }
    
}

const permitApprove = async (req,res) => {
    try {
        const { userId } = req.body; // This is actually the permit ID (confusing naming)
        console.log('🔥 Permit approval request received for ID:', userId);

        if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
            console.log('❌ Invalid permit ID:', userId);
            return res.status(400).json({
                error:"Invalid permit ID provided"
            })
        }

        console.log('🔍 Looking for permit with ID:', userId);
        const permit = await Permit.findById(userId)
            .populate("destination")
            .populate("userId", "name email phone");

        if (!permit) {
            console.log('❌ Permit not found with ID:', userId);
            return res.status(404).json({ error: "Permit not found" });
        }

        console.log('✅ Found permit:', permit);

        if(permit.status !== "pending"){
            console.log('❌ Permit status is not pending:', permit.status);
            return res.status(400).json({
                error:"Permit is already processed"
            })
        }

        const dest = await Destination.findById(permit.destination);

        if(!dest) {
            console.log('❌ Destination not found:', permit.destination);
            return res.status(404).json({ error: "Destination not found" });
        }

        console.log('✅ Found destination:', dest.name);

        if(dest.bookedNo >= dest.capacity){
            console.log('❌ Destination at full capacity:', dest.bookedNo, '>=', dest.capacity);
            return res.status(400).json({
                error:"The destination has reached full capacity"
            })
        }

        console.log('🎨 Generating QR code...');
        // Generate comprehensive QR code data
        const qrData = {
            permitId: permit._id,
            userId: permit.userId?._id || null,
            userName: permit.userId?.name || 'Guest',
            destination: dest.name,
            destinationId: dest._id,
            checkInDate: permit.check_in_date,
            checkOutDate: permit.check_out_date,
            approvedAt: new Date(),
            approvedBy: req.user?._id || null, // Authority who approved (make optional)
            validity: 'valid'
        }  

        console.log('📄 QR Data:', qrData);
        const qrCode = await Qrcode.toDataURL(JSON.stringify(qrData));
        console.log('✅ QR code generated successfully, length:', qrCode.length);
        
        console.log('💾 Updating permit status...');
        // Update permit status
        permit.status = "valid";
        permit.qrCode = qrCode;
        permit.approvedAt = new Date();
        permit.approvedBy = req.user?._id || null; // Make optional
        await permit.save();
        console.log('✅ Permit updated to valid status');

        console.log('🎯 Updating destination booked count...');
        // Update destination capacity
        dest.bookedNo += 1;
        await dest.save();
        console.log('✅ Destination booked count updated:', dest.bookedNo);

        // Prepare user notification data
        const userNotification = {
            type: 'permit_approved',
            message: `Your permit for ${dest.name} has been approved!`,
            permitId: permit._id,
            qrCode: qrCode,
            destination: dest.name,
            checkInDate: permit.check_in_date,
            checkOutDate: permit.check_out_date,
            userEmail: permit.userId?.email,
            userName: permit.userId?.name
        };

        // Update booking status to confirmed if this permit came from a booking
        if (permit.bookingId) {
            console.log('🔄 Updating booking status for ID:', permit.bookingId);
            try {
                // Use mongoose to update the booking status
                const mongoose = require('mongoose');
                const bookingSchema = new mongoose.Schema({}, { collection: 'bookings', strict: false });
                const Booking = mongoose.model('Booking', bookingSchema);
                
                await Booking.updateOne(
                    { _id: permit.bookingId },
                    { 
                        $set: { 
                            status: 'confirmed',
                            permitApprovedAt: new Date(),
                            permitId: permit._id.toString()
                        } 
                    }
                );
                
                console.log(`✅ Updated booking ${permit.bookingId} status to confirmed`);
            } catch (bookingUpdateError) {
                console.error(`❌ Failed to update booking status: ${bookingUpdateError}`);
                // Don't fail permit approval if booking update fails
            }
        } else {
            console.log('ℹ️ No booking ID found, permit was created directly');
        }

        // TODO: Add email/SMS notification service here
        // await sendNotificationToUser(userNotification);

        console.log('🎉 Permit approval completed successfully!');
        console.log('📋 Final response data:', {
            permitId: permit._id,
            status: permit.status,
            qrCodeLength: permit.qrCode?.length || 0,
            destination: dest.name
        });

        return res.json({
            success: true,
            message: "Permit approved successfully",
            permit: {
                _id: permit._id,
                status: permit.status,
                qrCode: permit.qrCode,
                approvedAt: permit.approvedAt,
                destination: dest.name,
                checkInDate: permit.check_in_date,
                checkOutDate: permit.check_out_date
            },
            userNotification // Send this to frontend for user updates
        })
    } 
    catch (error) {
        console.error("❌ Error approving permit:", error);
        console.error("🔍 Error stack:", error.stack);
        res.status(500).json({ 
            error: "Failed to approve permit", 
            details: error.message 
        });
    }
}

const destDetails = async (req, res) => {
    try {
        // Accept id from req.params for GET route
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid id" });

        const dest = await Destination.findById(id);

        if (!dest)
            return res.status(404).json({ error: "Destination not found" });

        const permits = await Permit.find({ destination: id })
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        // Enhanced response with better statistics
        const permitStats = {
            total: permits.length,
            pending: permits.filter(p => p.status === "pending").length,
            approved: permits.filter(p => p.status === "valid").length,
            expired: permits.filter(p => p.status === "expired").length
        };

        res.json({
            dest: {
                ...dest.toObject(),
                availableSpots: dest.capacity - dest.bookedNo
            },
            permits: permits.map(permit => ({
                _id: permit._id,
                userName: permit.userId?.name || 'Unknown',
                userEmail: permit.userId?.email,
                checkInDate: permit.check_in_date,
                checkOutDate: permit.check_out_date,
                status: permit.status,
                createdAt: permit.createdAt,
                approvedAt: permit.approvedAt
            })),
            permitStats
        });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch destination data" });
    }
}

// New function to check user permit status
const checkUserPermitStatus = async (req, res) => {
    try {
        const userId = req.user?._id; // From JWT token (make optional)
        const userEmail = req.user?.email; // Get user email for fallback search (make optional)
        console.log('🔍 Checking permits for user:', userId, 'email:', userEmail);
        
        // First, try to find permits by userId (if user is authenticated)
        let userPermits = [];
        if (userId) {
            userPermits = await Permit.find({ userId })
                .populate("destination", "name location")
                .sort({ createdAt: -1 });
        }

        console.log('📋 Found permits by userId:', userPermits.length);

        // If no permits found by userId and we have email, try to find by guest email (for permits created via FastAPI)
        if (userPermits.length === 0 && userEmail) {
            console.log('🔍 Searching by guest email:', userEmail);
            userPermits = await Permit.find({ guestEmail: userEmail })
                .populate("destination", "name location")
                .sort({ createdAt: -1 });
            console.log('📋 Found permits by guest email:', userPermits.length);
        }
        
        const permitsWithStatus = userPermits.map(permit => {
            const permitData = {
                _id: permit._id,
                destination: permit.destination?.name || 'Unknown',
                destinationLocation: permit.destination?.location,
                checkInDate: permit.check_in_date,
                checkOutDate: permit.check_out_date,
                status: permit.status,
                qrCode: permit.status === 'valid' ? permit.qrCode : null,
                approvedAt: permit.approvedAt,
                createdAt: permit.createdAt,
                isExpired: permit.status === 'expired' || (permit.check_out_date && new Date() > permit.check_out_date)
            };
            
            console.log(`📄 Permit ${permit._id}: status=${permit.status}, hasQR=${!!permit.qrCode}, qrLength=${permit.qrCode?.length || 0}`);
            return permitData;
        });

        return res.json({
            success: true,
            permits: permitsWithStatus,
            summary: {
                total: userPermits.length,
                pending: userPermits.filter(p => p.status === "pending").length,
                approved: userPermits.filter(p => p.status === "valid").length,
                expired: userPermits.filter(p => p.status === "expired").length
            }
        });
    } catch (error) {
        console.error("❌ Error checking user permit status:", error);
        return res.status(500).json({ error: "Failed to check permit status" });
    }
};

export { userDashboard, permitApprove, destDetails, checkUserPermitStatus }