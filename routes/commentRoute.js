import express from "express";
import {
  getAllComments,
  addComment,
  deleteComment,
  hideComment
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getAllComments);
router.post("/", addComment);
router.delete("/", deleteComment);
router.put("/", hideComment);

export default router;
