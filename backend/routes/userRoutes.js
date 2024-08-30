import express from "express";
const router = express.Router();
import { createUser } from "../controllers/userController.js";

//----------Create User-----------
router.route('/').post(createUser);

export default router;