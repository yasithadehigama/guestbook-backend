import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import commentRoute from "./routes/commentRoute.js";
import authRoute from "./routes/auth.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

const port = process.env.PORT;
const mongoDBUrl = process.env.MONGO_DB_URL;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/user", userRoute);

app.use("/api/comment", commentRoute);

app.use("/api/auth", authRoute);

app.use((obj, req, res, next) => {
  const statusCode = obj.status;
  const message = obj.message;
  return res.status(statusCode).json({
    success: [200, 201, 204].some((a) => a === obj.status) ? true : false,
    status: statusCode,
    message: message,
    data: obj.data,
  });
});

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoDBUrl);
    console.log("Database connected");
  } catch (error) {
    throw error;
  }
};

app.listen(port, () => {
  connectToDatabase();
  console.log(`Server is running on port ${port}`);
});
