import {Router} from 'express';
import { userReg,loginUser,getUser,passwordChange } from '../controllers/user.controller.js';
import { verifyJWT } from '../config and middleware/authorization.middleware.js';
import jwt from "jsonwebtoken";
import passport from 'passport';

const router = Router();

router
.route("/register")
.post(userReg)

router.route("/login")
.post(loginUser)

router
.route("/user-profile")
.get(verifyJWT, getUser)

 router
.route("/change-password")
.post(verifyJWT,passwordChange)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}`);
  }
);

export default router