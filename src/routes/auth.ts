import express from "express";
import User from "../models/user";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
const AuthRouter = express.Router();

AuthRouter.post("/login", async (req, res) => {
  const { email, password }: { email: string; password: string } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (await compare(password, user.password)) {
      const token = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "30d" }
      );
      return res.status(200).json({
        message: "Login Success",
        user: {
          username: user.username,
          id: user._id,
          email: user.email,
        },
        token,
      });
    } else {
      return res.status(400).json({ message: "Incorrect Password" });
    }
  } else {
    return res.status(400).json({ message: "User Not found" });
  }
});

AuthRouter.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "email already exists" });
  }
  user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const newUser = await User.create({ username, email, password });
  if (newUser) {
    const token = jwt.sign(
      {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );
    return res.status(200).json({
      message: "User created",
      user: {
        username: newUser.username,
        id: newUser._id,
        email: newUser.email,
      },
      token,
    });
  } else {
    return res.status(400).json({ message: "User not created" });
  }
});

export default AuthRouter;
