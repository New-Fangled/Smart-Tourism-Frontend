import mongoose,{Schema} from "mongoose"

const permitSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default: null // Allow null for booking-generated permits
    },
    destination:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Destination",
        required:true
    },
    check_in_date:{
        type:Date,
        required:true
    },
    check_out_date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["valid","expired","pending"],
        default:"pending"
    },
    qrCode:{
        type:String,
        default:null // Allow null until approved
    },
    entered: {
        type: Boolean,
        default: false
    },
    validTill: {
        type: Date
    },
    ecoTax:{
        type:Number,
        required:true
    },
    approvedAt: {
        type: Date,
        default: null
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    // Booking integration fields
    bookingId: {
        type: String, // FastAPI booking ID
        default: null
    },
    guestName: {
        type: String,
        default: null
    },
    guestEmail: {
        type: String,
        default: null
    },
    guestPhone: {
        type: String,
        default: null
    }
},{
    timestamps:true
})

export const Permit = mongoose.model("Permit",permitSchema)