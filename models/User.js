import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("users", UserSchema);
