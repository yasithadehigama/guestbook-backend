import express from "express";
import { sendEmail, forgetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-email", sendEmail);
router.post("/forget-password", forgetPassword);

export default router;
