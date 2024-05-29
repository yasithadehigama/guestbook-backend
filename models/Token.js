import mongoose from "mongoose";

const TokenSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expire: 300,
  },
});

export default mongoose.model("tokens", TokenSchema);
