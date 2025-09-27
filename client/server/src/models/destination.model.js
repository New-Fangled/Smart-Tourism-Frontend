import mongoose,{Schema} from "mongoose"

const destinationSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    capacity:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:["open","closed"],
        default:"open"
    },
    bookedNo:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

export const Destination = mongoose.model("Destination",destinationSchema)