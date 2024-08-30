import express from "express";
const router = express.Router();
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  updateCurrentUserProfile
} from "../controllers/userController.js";
//----Authenticate and authorize user---
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

//----------Create User(Admin Function)-----------
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

//--login and logout of the user--
router.post("/auth", loginUser);
//--Logout a user-----------------
router.post("/logout", logoutCurrentUser);
//--Access user profile after authentication
router.route("/profile").get(authenticate, updateCurrentUserProfile);

export default router;
