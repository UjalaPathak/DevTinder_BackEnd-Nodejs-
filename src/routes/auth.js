const express = require("express");
const appSchema = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateSignuData } = require("../utils/validateSignup");
const saltRounds = 10;

require("dotenv").config();

appSchema
  .post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        throw new Error("Invalid Credential");
      }
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("Invalid Credential");
      }
      //create token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, {
        expiresIn: "7d",
      });

      res.cookie("token", token);
      res.send(user);
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }
  })

  .post("/signup", async (req, res) => {
    try {
      //validate the request
      validateSignuData(req.body);

      const { firstName, lastName, email, password } = req.body;
      //convert password in hash
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
      });
      const savedUser = await user.save();
      const token = jwt.sign(
        { _id: savedUser._id }, // use the _id from saved user
        process.env.JWT_TOKEN, // secret key
        { expiresIn: "7d" } // token validity
      );
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res
        .status(201)
        .json({ message: "User Added Successfully", data: savedUser });
    } catch (err) {
      // Handle MongoDB duplicate key error
      if (err.code === 11000 && err.keyPattern?.email) {
        return res.status(400).json({
          message: "Email already exists. Please use a different one.",
        });
      }

      // Handle validation or other errors
      return res.status(500).json({
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  })
  .post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout Successfully");
  });

module.exports = { appSchema };
