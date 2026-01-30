import { Request, Response } from "express";
import { Invite } from "../models/Invite.model";
import { User } from "../models/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";


// --- 0️⃣ Validate Invite (PUBLIC) ---
export const validateInvite = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const invite = await Invite.findOne({ token });

    if (!invite) {
      return res.status(400).json({ message: "Invalid invite token" });
    }

    if (invite.acceptedAt) {
      return res.status(400).json({ message: "Invite already used" });
    }

    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite expired" });
    }

    res.status(200).json({
      email: invite.email,
      role: invite.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// --- 1️⃣ Admin Invite ---
export const inviteUser = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h expiry

    const invite = await Invite.create({ email, role, token, expiresAt });

    // Get frontend URL from environment or fallback to localhost
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    
    // Log invite link for admin reference
    console.log(`Invite link: ${frontendUrl}/register/${token}`);

    res.status(201).json({ 
      message: "Invite created", 
      token: invite.token,
      inviteLink: `${frontendUrl}/register/${token}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- 2️⃣ Register via Invite ---
export const registerViaInvite = async (req: Request, res: Response) => {
  try {
    const { token, name, password } = req.body;

    // Find invite
    const invite = await Invite.findOne({ token });
    if (!invite) return res.status(400).json({ message: "Invalid invite token" });
    if (invite.acceptedAt) return res.status(400).json({ message: "Invite already used" });
    if (invite.expiresAt < new Date()) return res.status(400).json({ message: "Invite expired" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role,
      invitedAt: new Date(),
    });

    // Mark invite as accepted
    invite.acceptedAt = new Date();
    await invite.save();

    // Generate JWT token (same as login)
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- 3️⃣ Login ---
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.status !== "ACTIVE") return res.status(403).json({ message: "User inactive" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
