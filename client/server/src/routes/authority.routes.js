import {Router} from 'express';
import { authorization, verifyJWT } from '../config and middleware/authorization.middleware.js';
import { destDetails, permitApprove, userDashboard, checkUserPermitStatus } from '../controllers/authority.controller.js';
const router = Router();

router
.route("/Dashboard")
.get(verifyJWT, authorization("authority"), userDashboard)

router
.route("/allowing-permits")
.post(verifyJWT, authorization("authority"), permitApprove)

router
.route("/destination-details/:id")
.get(verifyJWT, authorization("authority"), destDetails)

// New route for users to check their permit status
router
.route("/my-permits")
.get(verifyJWT, checkUserPermitStatus)

export default router;