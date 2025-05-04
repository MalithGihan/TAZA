import jwt from "jsonwebtoken";
import User from "../schema/userSchema.js";

export const userController = {
  registerUser: async (req, res) => {
    const { name, phone, email, password } = req.body;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({ name, phone, email, password });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Register User Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ message: "Login successful", token, user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  getTest: async (req, res) => {
    try {
      res.json({ message: "Test successful" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
};
