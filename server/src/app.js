import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authorityRoutes from "./routes/authority.routes.js"
import userRoutes from "./routes/user.routes.js"
import configurePassport from "./config and middleware/passport.js";
import passport from "passport";

const app = express();

// Middleware
// app.use is used for middleware in express
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public")); //used to serve static files like images, css, js, etc.
app.use(cookieParser());

configurePassport(passport);
app.use(passport.initialize());

app.use("/authority",authorityRoutes);
app.use("/users",userRoutes)

// Add a test route
app.get("/test", (req, res) => {
    res.json({ message: "Backend server is running!" });
});



export {app};