import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
  isHide: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("comments", CommentSchema);
