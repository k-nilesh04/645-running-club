import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." , success: false});
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists.", success: false });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10

    // Create a new user
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully.", success: true });

  } catch (error) {
    next(error);
  }
}