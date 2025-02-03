import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  // console.log(req.body);
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    // console.log(newUser);
    await newUser.save();
    
    // console.log(newUser);

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET_KEY
    );
    // console.log(token);
    const { password: pass, ...rest } = newUser._doc;
    
    res
  .status(200)
  .cookie("access_token", token, {
    httpOnly: true, // Prevent client-side access
    secure: false, // Only true if using HTTPS
    sameSite: "Lax", // Or "None" with secure: true
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
  .json({ message: "Signup successful", user: rest });
  } catch (error) {
    // console.log(error);
    next(errorHandler(500, "Internal server error"));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(password)
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email }).select("+password");

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET_KEY
    );
    // console.log(token)

    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true, // Prevent client-side access
        secure: false, // Only true if using HTTPS
        sameSite: "Lax", // Or "None" with secure: true
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json(rest);
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    // console.log(req.user)
    const user = await User.findById(req.user.id).select("-password");
    // console.log(user);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
