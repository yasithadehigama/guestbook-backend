import { createSuccess } from "../helpers/success.js";
import { createError } from "../helpers/error.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const userType = "USER";

  const newUser = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: hashedPassword,
    userType: userType,
  });

  try {
    await newUser.save();
    return next(createSuccess(200, "User Registed"));
  } catch (error) {
    console.log(error);
    return next(500, "Internal Server Error");
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(404, "User Not Found!"));
    }

    if (user.isBanned) {
      return next(createError(403, "User Banned!"));
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(400, "Password is Incorrect!");
    }

    const token = jwt.sign(
      {
        email: user.email,
        userType: user.userType,
        userName: user.userName,
      },
      process.env.JWT_SECRET_KEY
    );

    const data = {
      id: user._id,
      access_token: token,
      email: user.email,
      userType: user.userType,
    };

    return next(createSuccess(200, "User Login Success!", data));
  } catch (error) {
    console.log(error);
    return next(500, "Internal Server Error!");
  }
};

export const updateUserName = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      return next(createError(403, "Unauthorized"));
    } else {
      //console.log(data);
      const user = await User.findOne({ email: data.email });
      user.userName = req.body.userName;
      try {
        await User.findOneAndUpdate(
          { email: data.email },
          { $set: user },
          { new: true }
        );

        return next(createSuccess(200, "User Updated!"));
      } catch (error) {
        return next(
          createError(500, "Something went wrong while update the user")
        );
      }
    }
  });
};

export const getAllUsers = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      return next(createError(403, "Unauthorized"));
    } else {
      try {
        const allUsers = await User.find();
        return next(createSuccess(200, "Get All data", allUsers));
      } catch (error) {
        console.log(error);
        return next(createSuccess(500, "Failed"));
      }
    }
  });
};

export const deleteUser = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      return next(createError(403, "Unauthorized"));
    } else {
      try {
        await User.deleteOne({ _id: req.query.id });
        return next(createSuccess(200, "User Deleted!"));
      } catch (error) {
        console.log(error);
        return next(createSuccess(500, "Failed to Delete User!"));
      }
    }
  });
};

export const banUser = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      return next(createError(403, "Unauthorized"));
    } else {
      try {
        await User.findByIdAndUpdate(req.query.id, { isBanned: true });
        return next(createSuccess(200, "User Banned!"));
      } catch (error) {
        console.log(error);
        return next(createSuccess(500, "Failed to Ban User!"));
      }
    }
  });
};

export const deleteAccount = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      return next(createError(403, "Unauthorized"));
    } else {
      try {
        await User.deleteOne({ _id: req.query.id });
        return next(createSuccess(200, "User Account Deleted!"));
      } catch (error) {
        console.log(error);
        return next(createSuccess(500, "Failed to Delete User Account!"));
      }
    }
  });
};

export const resetPassword = async (req, res, next) => {
  console.log(req.body);
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      return next(createError(403, "Unauthorized"));
    } else {
      const user = await User.findOne({ email: data.email });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;

      try {
        await User.findOneAndUpdate(
          { email: data.email },
          { $set: user },
          { new: true }
        );

        return next(createSuccess(200, "Password Updated!"));
      } catch (error) {
        return next(
          createError(500, "Something went wrong while update the password")
        );
      }
    }
  });
};
