/**
 * This script for testing purpose for Admin Users
 * From this script Admin user will create
 *  */

import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const init = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    await register();
    await mongoose.connection.close();
    return;
  } catch (error) {
    return error;
  }
};
const register = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin", salt);

  const newUser = new User({
    userName: "Admin",
    email: "testadmin@gmail.com",
    password: hashedPassword,
    userType: "ADMIN",
  });

  try {
    const response = await newUser.save();
    console.log("Admin User Added");
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

init();
