import express from "express";
const router = express.Router();
import { createUser, loginUser,logoutCurrentUser } from "../controllers/userController.js";

//----------Create User-----------
router.route('/').post(createUser);
//--login and logout of the user--
router.post('/auth', loginUser);
//--Logout a user
router.post('/logout', logoutCurrentUser)

export default router;