import express from "express";
import {
  login,
  register,
  getAllUsers,
  deleteUser,
  banUser,
  updateUserName,
  deleteAccount,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-users", getAllUsers);
router.delete("/", deleteUser);
router.put("/", banUser);
router.put("/update-username", updateUserName);
router.delete("/delete-account", deleteAccount);
router.post("/reset-password", resetPassword);

export default router;
