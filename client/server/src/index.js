import connectDB from "./db/db.js";
import dotenv from "dotenv";
import {app} from "./app.js"

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`server is running on port ${process.env.PORT || 5000}`)
    })
    
})
.catch((error) => {
        console.log("failed to connect mongoose",error)
    })

