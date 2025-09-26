from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from datetime import date, datetime, timedelta
from typing import List, Optional
import uvicorn
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
# Add database name to the URI if it's Atlas
if "mongodb+srv:" in MONGODB_URI and not MONGODB_URI.endswith("/Trivago"):
    MONGODB_URL = f"{MONGODB_URI}/Trivago"
else:
    MONGODB_URL = MONGODB_URI
    
DATABASE_NAME = "Trivago"  # Same database as Express.js server
BOOKINGS_COLLECTION = "bookings"  # Separate collection for bookings
DESTINATIONS_COLLECTION = "destinations"  # Your destinations collection

# Global variables for database
mongodb_client: AsyncIOMotorClient = None
database = None
mongodb_connected = False

# Custom ObjectId type for Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Database connection management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global mongodb_client, database, mongodb_connected
    try:
        mongodb_client = AsyncIOMotorClient(MONGODB_URL)
        database = mongodb_client[DATABASE_NAME]
        # Test connection
        await database.command("ping")
        mongodb_connected = True
        print("Connected to MongoDB")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        print("Running with fallback data...")
        mongodb_connected = False
    yield
    # Shutdown
    if mongodb_client:
        mongodb_client.close()
        print("Disconnected from MongoDB")

app = FastAPI(
    title="Booking API with Availability Management",
    description="API for managing bookings with destination-based availability limits",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # React app URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for Bookings
class BookingRequest(BaseModel):
    check_in_date: date = Field(..., description="Check-in date")
    check_out_date: date = Field(..., description="Check-out date")
    destination: str = Field(..., min_length=1, max_length=100, description="Destination city or location")
    guest_name: str = Field(..., min_length=1, max_length=100)
    guest_email: str = Field(..., min_length=5, max_length=100)
    guest_phone: Optional[str] = Field(None, max_length=20)
    
    @validator('check_out_date')
    def validate_dates(cls, check_out_date, values):
        if 'check_in_date' in values and check_out_date <= values['check_in_date']:
            raise ValueError('Check-out date must be after check-in date')
        return check_out_date
    
    @validator('check_in_date')
    def validate_check_in_date(cls, check_in_date):
        if check_in_date < date.today():
            raise ValueError('Check-in date cannot be in the past')
        return check_in_date

class BookingResponse(BaseModel):
    id: str = Field(alias="_id")
    check_in_date: date
    check_out_date: date
    destination: str
    nights: int
    guest_name: str
    guest_email: str
    guest_phone: Optional[str]
    created_at: datetime
    status: str  # Removed default value so it uses actual database status
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class BookingUpdate(BaseModel):
    check_in_date: Optional[date] = None
    check_out_date: Optional[date] = None
    destination: Optional[str] = None

# Database helper functions
async def get_bookings_collection():
    return database[BOOKINGS_COLLECTION]

async def get_destinations_collection():
    return database[DESTINATIONS_COLLECTION]

async def create_permit_request(booking_data, booking_id):
    """Create a permit request in the permits collection when a booking is made"""
    try:
        print(f"🟡 Starting permit creation for booking: {booking_id}")
        print(f"📝 Booking data: {booking_data}")
        
        permits_collection = database["permits"]  # Express.js uses permits collection
        destinations_collection = await get_destinations_collection()
        
        # Find destination ID by name
        destination_doc = await destinations_collection.find_one(
            {"name": {"$regex": f"^{booking_data['destination']}$", "$options": "i"}}
        )
        
        if not destination_doc:
            print(f"❌ Destination not found for permit creation: {booking_data['destination']}")
            print("Available destinations:", [doc async for doc in destinations_collection.find({}, {"name": 1})])
            return
        
        print(f"✅ Found destination: {destination_doc['name']} (ID: {destination_doc['_id']})")
        
        # Calculate eco tax - Fixed rate of ₹50
        eco_tax = 50  # Fixed eco tax of ₹50 for all bookings
        
        permit_data = {
            "userId": None,  # This will be updated when user system is integrated
            "destination": destination_doc["_id"],
            "check_in_date": booking_data["check_in_date"],
            "check_out_date": booking_data["check_out_date"],
            "status": "pending",
            "qrCode": None,  # Will be generated upon approval
            "entered": False,
            "ecoTax": eco_tax,
            "bookingId": booking_id,  # Link to the original booking
            "guestName": booking_data["guest_name"],
            "guestEmail": booking_data["guest_email"],
            "guestPhone": booking_data.get("guest_phone"),
            "createdAt": booking_data["created_at"],
            "approvedAt": None,
            "approvedBy": None
        }
        
        print(f"📋 Permit data to insert: {permit_data}")
        
        result = await permits_collection.insert_one(permit_data)
        
        if result.inserted_id:
            print(f"✅ Permit request created: {result.inserted_id} for booking: {booking_id}")
            print(f"📧 Guest: {booking_data['guest_name']} ({booking_data['guest_email']})")
            print(f"📍 Destination: {booking_data['destination']}")
            print(f"💰 Eco Tax: ₹{eco_tax}")
            
            # Verify the permit was created
            created_permit = await permits_collection.find_one({"_id": result.inserted_id})
            print(f"🔍 Permit verification: {created_permit}")
        else:
            print(f"❌ Failed to create permit request for booking: {booking_id}")
            
    except Exception as e:
        print(f"❌ Error creating permit request: {e}")
        import traceback
        traceback.print_exc()
        # Don't fail the booking if permit creation fails

def booking_helper(booking) -> dict:
    """Convert MongoDB booking document to dictionary"""
    return {
        "_id": str(booking["_id"]),
        "check_in_date": booking["check_in_date"].date() if isinstance(booking["check_in_date"], datetime) else booking["check_in_date"],
        "check_out_date": booking["check_out_date"].date() if isinstance(booking["check_out_date"], datetime) else booking["check_out_date"],
        "destination": booking["destination"],
        "nights": booking["nights"],
        "guest_name": booking["guest_name"],
        "guest_email": booking["guest_email"],
        "guest_phone": booking.get("guest_phone"),
        "created_at": booking["created_at"],
        "status": booking["status"]
    }

async def check_availability(check_in_date: date, check_out_date: date, destination: str):
    """Check availability for given dates and destination based on destination capacity"""
    global mongodb_connected
    
    if not mongodb_connected:
        raise HTTPException(
            status_code=503,
            detail="Database connection is not available. Please try again later."
        )
    
    try:
        # Get data from MongoDB
        destinations_collection = await get_destinations_collection()
        destination_doc = await destinations_collection.find_one(
            {"name": {"$regex": f"^{destination}$", "$options": "i"}}
        )
        
        if not destination_doc:
            raise HTTPException(
                status_code=404,
                detail=f"Destination '{destination}' not found in database."
            )
        
        # Check if destination is open
        if destination_doc.get("status", "open") != "open":
            raise HTTPException(
                status_code=400,
                detail=f"Destination '{destination}' is currently closed for bookings."
            )
        
        total_capacity = destination_doc.get("capacity", 0)
        currently_booked = destination_doc.get("bookedNo", 0)
        available_spots = total_capacity - currently_booked
        
        if available_spots <= 0:
            raise HTTPException(
                status_code=400,
                detail=f"No availability for {destination}. Capacity: {total_capacity}, Currently booked: {currently_booked}"
            )
        
        return {
            "destination": destination,
            "total_capacity": total_capacity,
            "currently_booked": currently_booked,
            "available_spots": available_spots,
            "source": "mongodb"
        }
            
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        print(f"MongoDB query failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Database query failed. Please try again later."
        )
    
    return True

# Destinations Endpoints
@app.get("/destinations")
async def get_available_destinations():
    """Get list of all available destinations"""
    destinations_collection = await get_destinations_collection()
    
    destinations = []
    async for dest in destinations_collection.find({"status": "open"}):
        destinations.append({
            "id": str(dest["_id"]),
            "name": dest["name"],
            "capacity": dest.get("capacity", 0),
            "bookedNo": dest.get("bookedNo", 0),
            "available_spots": dest.get("capacity", 0) - dest.get("bookedNo", 0),
            "status": dest.get("status", "open")
        })
    
    return {"destinations": destinations}

@app.get("/availability")
async def check_booking_availability(
    check_in_date: date,
    check_out_date: date,
    destination: str
):
    """Check availability for given dates and destination"""
    # Validate dates
    if check_out_date <= check_in_date:
        raise HTTPException(status_code=400, detail="Check-out date must be after check-in date")
    
    if check_in_date < date.today():
        raise HTTPException(status_code=400, detail="Check-in date cannot be in the past")
    
    try:
        # Use the updated check_availability function
        availability_info = await check_availability(check_in_date, check_out_date, destination)
        
        # If no exception is raised, availability exists
        nights = (check_out_date - check_in_date).days
        
        return {
            "available": True,
            "message": f"Available for booking in {destination}",
            "check_in_date": check_in_date,
            "check_out_date": check_out_date,
            "destination": destination,
            "nights": nights,
            "capacity_info": availability_info
        }
        
    except HTTPException as e:
        # Return availability info even if not available
        nights = (check_out_date - check_in_date).days
        
        return {
            "available": False,
            "message": e.detail,
            "check_in_date": check_in_date,
            "check_out_date": check_out_date,
            "destination": destination,
            "nights": nights
        }

@app.post("/bookings", response_model=BookingResponse)
async def create_booking(booking: BookingRequest):
    """Create a new booking with availability check"""
    global mongodb_connected
    
    if not mongodb_connected:
        raise HTTPException(
            status_code=503,
            detail="Database connection is not available. Please try again later."
        )
    
    # Check availability based on destination limits
    availability = await check_availability(
        booking.check_in_date,
        booking.check_out_date,
        booking.destination
    )
    
    try:
        bookings_collection = await get_bookings_collection()
        
        nights = (booking.check_out_date - booking.check_in_date).days
        
        booking_data = {
            "check_in_date": datetime.combine(booking.check_in_date, datetime.min.time()),
            "check_out_date": datetime.combine(booking.check_out_date, datetime.min.time()),
            "destination": booking.destination.strip().title(),
            "nights": nights,
            "guest_name": booking.guest_name.strip().title(),
            "guest_email": booking.guest_email.lower(),
            "guest_phone": booking.guest_phone,
            "created_at": datetime.now(),
            "status": "pending_approval",  # Changed from "confirmed" to "pending_approval"
            "booking_id": str(uuid.uuid4())
        }
        
        result = await bookings_collection.insert_one(booking_data)
        
        if result.inserted_id:
            # Update the destination's booked count
            destinations_collection = await get_destinations_collection()
            await destinations_collection.update_one(
                {"name": {"$regex": f"^{booking.destination}$", "$options": "i"}},
                {"$inc": {"bookedNo": 1}}
            )
            
            print(f"🟡 About to create permit request for booking: {str(result.inserted_id)}")
            
            # Create permit request automatically
            await create_permit_request(booking_data, str(result.inserted_id))
            
            print(f"🟢 Finished permit creation process")
            
            new_booking = await bookings_collection.find_one({"_id": result.inserted_id})
            return BookingResponse(**booking_helper(new_booking))
        
        raise HTTPException(status_code=400, detail="Failed to create booking")
        
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        print(f"MongoDB booking save failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to save booking to database. Please try again later."
        )

@app.get("/bookings", response_model=List[BookingResponse])
async def get_bookings(skip: int = 0, limit: int = 100):
    """Get all bookings"""
    global mongodb_connected
    
    if not mongodb_connected:
        raise HTTPException(
            status_code=503,
            detail="Database connection is not available. Please try again later."
        )
    
    try:
        bookings_collection = await get_bookings_collection()
        bookings = []
        
        async for booking in bookings_collection.find().skip(skip).limit(limit):
            bookings.append(BookingResponse(**booking_helper(booking)))
        
        return bookings
        
    except Exception as e:
        print(f"MongoDB query failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve bookings from database. Please try again later."
        )

@app.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: str):
    """Get a specific booking by ID"""
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(status_code=400, detail="Invalid booking ID")
    
    bookings_collection = await get_bookings_collection()
    booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return BookingResponse(**booking_helper(booking))

@app.put("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(booking_id: str, booking_update: BookingUpdate):
    """Update an existing booking"""
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(status_code=400, detail="Invalid booking ID")
    
    bookings_collection = await get_bookings_collection()
    existing_booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
    
    if not existing_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    update_data = {}
    
    # Update fields if provided - convert dates to datetime for MongoDB
    if booking_update.check_in_date:
        if booking_update.check_in_date < date.today():
            raise HTTPException(status_code=400, detail="Check-in date cannot be in the past")
        update_data["check_in_date"] = datetime.combine(booking_update.check_in_date, datetime.min.time())
    
    if booking_update.check_out_date:
        update_data["check_out_date"] = datetime.combine(booking_update.check_out_date, datetime.min.time())
    
    if booking_update.destination:
        update_data["destination"] = booking_update.destination.strip().title()
    
    # Get final dates for validation (convert back to date for comparison)
    final_check_in_dt = update_data.get("check_in_date", existing_booking["check_in_date"])
    final_check_out_dt = update_data.get("check_out_date", existing_booking["check_out_date"])
    final_destination = update_data.get("destination", existing_booking["destination"])
    
    final_check_in = final_check_in_dt.date() if isinstance(final_check_in_dt, datetime) else final_check_in_dt
    final_check_out = final_check_out_dt.date() if isinstance(final_check_out_dt, datetime) else final_check_out_dt
    
    # Validate dates after update
    if final_check_out <= final_check_in:
        raise HTTPException(status_code=400, detail="Check-out date must be after check-in date")
    
    # Check availability for updated booking (if dates or destination changed)
    if booking_update.check_in_date or booking_update.check_out_date or booking_update.destination:
        try:
            await check_availability(final_check_in, final_check_out, final_destination)
        except HTTPException:
            raise HTTPException(status_code=400, detail="Updated booking dates/destination not available")
    
    # Recalculate nights
    update_data["nights"] = (final_check_out - final_check_in).days
    
    if update_data:
        result = await bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 1:
            updated_booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
            return BookingResponse(**booking_helper(updated_booking))
    
    raise HTTPException(status_code=400, detail="Failed to update booking")

@app.put("/bookings/{booking_id}/cancel")
async def cancel_booking(booking_id: str):
    """Cancel a booking"""
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(status_code=400, detail="Invalid booking ID")
    
    bookings_collection = await get_bookings_collection()
    result = await bookings_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": "cancelled"}}
    )
    
    if result.modified_count == 1:
        return {"message": "Booking cancelled successfully"}
    
    raise HTTPException(status_code=404, detail="Booking not found")

@app.get("/bookings/guest/{guest_email}")
async def get_bookings_by_guest(guest_email: str):
    """Get bookings by guest email"""
    bookings_collection = await get_bookings_collection()
    bookings = []
    
    async for booking in bookings_collection.find({"guest_email": guest_email.lower()}):
        bookings.append(BookingResponse(**booking_helper(booking)))
    
    return bookings

@app.get("/bookings/search/destination/{destination}")
async def search_bookings_by_destination(destination: str):
    """Search bookings by destination"""
    bookings_collection = await get_bookings_collection()
    bookings = []
    
    # Case-insensitive search
    regex_pattern = {"$regex": destination, "$options": "i"}
    async for booking in bookings_collection.find({"destination": regex_pattern}):
        bookings.append(BookingResponse(**booking_helper(booking)))
    
    return bookings

@app.get("/bookings/search/date-range")
async def search_bookings_by_date_range(
    start_date: date,
    end_date: date
):
    """Search bookings within a date range"""
    if end_date <= start_date:
        raise HTTPException(status_code=400, detail="End date must be after start date")
    
    bookings_collection = await get_bookings_collection()
    bookings = []
    
    # Convert dates to datetime for MongoDB query
    start_datetime = datetime.combine(start_date, datetime.min.time())
    end_datetime = datetime.combine(end_date, datetime.min.time())
    
    # Find bookings that overlap with the given date range
    query = {
        "$or": [
            {
                "check_in_date": {"$gte": start_datetime, "$lt": end_datetime}
            },
            {
                "check_out_date": {"$gt": start_datetime, "$lte": end_datetime}
            },
            {
                "$and": [
                    {"check_in_date": {"$lte": start_datetime}},
                    {"check_out_date": {"$gte": end_datetime}}
                ]
            }
        ]
    }
    
    async for booking in bookings_collection.find(query):
        bookings.append(BookingResponse(**booking_helper(booking)))
    
    return bookings

# Debug endpoint to check permits
@app.get("/debug/permits")
async def get_permits_debug():
    """Debug endpoint to check permits in database"""
    global mongodb_connected
    
    try:
        if not mongodb_connected:
            return {"error": "MongoDB not connected", "mongodb_connected": False}
            
        permits_collection = database["permits"]
        permits = []
        
        async for permit in permits_collection.find().sort("createdAt", -1).limit(10):
            permits.append({
                "_id": str(permit["_id"]),
                "status": permit.get("status"),
                "guestName": permit.get("guestName"),
                "guestEmail": permit.get("guestEmail"),
                "destination": str(permit.get("destination")) if permit.get("destination") else None,
                "bookingId": permit.get("bookingId"),
                "createdAt": str(permit.get("createdAt")) if permit.get("createdAt") else None,
                "ecoTax": permit.get("ecoTax")
            })
        
        return {
            "total_permits": len(permits),
            "permits": permits,
            "mongodb_connected": mongodb_connected
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "mongodb_connected": mongodb_connected
        }

@app.get("/")
async def root():
    return {"message": "Welcome to the Booking API with Availability Management"}

@app.get("/destinations")
async def get_available_destinations():
    """Get list of all available destinations"""
    destinations_collection = await get_destinations_collection()
    
    destinations = []
    async for dest in destinations_collection.find({"status": "open"}):
        destinations.append({
            "id": str(dest["_id"]),
            "name": dest["name"],
            "capacity": dest.get("capacity", 0),
            "bookedNo": dest.get("bookedNo", 0),
            "available_spots": dest.get("capacity", 0) - dest.get("bookedNo", 0),
            "status": dest.get("status", "open")
        })
    
    return {"destinations": destinations}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await database.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)