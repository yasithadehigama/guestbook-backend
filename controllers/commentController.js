import { createSuccess } from "../helpers/success.js";
import { createError } from "../helpers/error.js";
import Comment from "../models/Comment.js";
import jwt from "jsonwebtoken";

export const getAllComments = async (req, res, next) => {
  try {
    const allComments = await Comment.find({ isHide: false });
    return next(createSuccess(200, "Get All data", allComments));
  } catch (error) {
    console.log(error);
    return next(createSuccess(500, "Failed"));
  }
};

export const addComment = async (req, res, next) => {
  let userType;
  let userName;
  const token = req.headers["authorization"]?.split(" ")[1];
  await jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    console.log(decodedToken);
    if (decodedToken?.userType == "ADMIN") {
      userType = "ADMIN";
      userName = decodedToken.userName;
    } else if (decodedToken?.userType == "USER") {
      userType = "USER";
      userName = decodedToken.userName;
    } else {
      console.log("2");
      userType = "GUEST";
      userName = "Guest User";
    }
  });

  const newComment = new Comment({
    comment: req.body.comment,
    userName: userName,
    userType: userType,
    isHide: false,
  });

  try {
    await newComment.save();
    return next(createSuccess(200, "Comment Added!"));
  } catch (error) {
    console.log(error);
    return next(500, "Internal Server Error");
  }
};

export const deleteComment = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      return next(createError(403, "Unauthorized"));
    } else {
      try {
        await Comment.deleteOne({ _id: req.query.id });
        return next(createSuccess(200, "Comment Deleted!"));
      } catch (error) {
        console.log(error);
        return next(createSuccess(500, "Failed to Delete Comment!"));
      }
    }
  });
};

export const hideComment = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      return next(createError(403, "Unauthorized"));
    } else {
      try {
        await Comment.findByIdAndUpdate(req.query.id, { isHide: true });
        return next(createSuccess(200, "Comment Deleted!"));
      } catch (error) {
        console.log(error);
        return next(createSuccess(500, "Failed to Delete Comment!"));
      }
    }
  });
};
