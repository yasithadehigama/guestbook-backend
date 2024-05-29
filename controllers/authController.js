import { createSuccess } from "../helpers/success.js";
import { createError } from "../helpers/error.js";
import Token from "../models/Token.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const sendEmail = async (req, res, next) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return next(createError(404, "User Not Found!"));
    }
    console.log(user);

    const tokenPayload = {
      email: email,
      id: user._id,
    };

    const expireTIme = 300;

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: expireTIme,
    });

    const newToken = new Token({ email: email, token: token });
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FORGET_PASSWORD_FROM_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    const mailOptions = {
      from: process.env.FORGET_PASSWORD_FROM_EMAIL,
      to: user.email,
      subject: "Password Request",
      html: `<html>
        <head>
            <title>Password Reset Request</title>
        </head>

            <body>
                <h1>Password Reset Request</h1>
                <p>Dear, </p>
                <p>We have recevied a request to reset password for your account. To complete the reset process please click on the button </p>
                <a href=${process.env.LIVE_URL}/reset/${token}><button style="background-color: #4CAF50">Reset Password</button>
                <p>Please not that this link will valid 5 miniutes</p>
                <p>Thank you</p>
            </body>
        </html>`,
    };

    mailTransporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
      } else {
        await newToken.save({
          email: email,
          token: token,
        });
        console.log("Email sent: " + info.response);
        return next(createSuccess(200, "Email Sent!"));
      }
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "Internal Server Error"));
  }
};

export const forgetPassword = async (req, res, next) => {
  const token = req.body.token;
  const password = req.body.password;

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      return next(createError(500, "Reset Link is Expired!"));
    } else {
      const user = await User.findOne({ email: data.email });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;

      try {
        await User.findOneAndUpdate(
          { _id: user._id },
          { $set: user },
          { new: true }
        );

        return next(createSuccess(200, "Password Reset Success"));
      } catch (error) {
        return next(
          createError(500, "Something went wrong while reset password")
        );
      }
    }
  });
};
