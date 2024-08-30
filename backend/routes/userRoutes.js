import express from "express";
const router = express.Router();
import { createUser, loginUser } from "../controllers/userController.js";

//----------Create User-----------
router.route('/').post(createUser);
//--login and logout of the user--
router.post('/auth', loginUser);

export default router;