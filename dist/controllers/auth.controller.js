"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerViaInvite = exports.inviteUser = exports.validateInvite = void 0;
const Invite_model_1 = require("../models/Invite.model");
const User_model_1 = require("../models/User.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
// --- 0️⃣ Validate Invite (PUBLIC) ---
const validateInvite = async (req, res) => {
    try {
        const { token } = req.params;
        const invite = await Invite_model_1.Invite.findOne({ token });
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.validateInvite = validateInvite;
// --- 1️⃣ Admin Invite ---
const inviteUser = async (req, res) => {
    try {
        const { email, role } = req.body;
        // Check if user already exists
        const userExists = await User_model_1.User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });
        // Generate token
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h expiry
        const invite = await Invite_model_1.Invite.create({ email, role, token, expiresAt });
        // Simulate email by console
        console.log(`Invite link: http://localhost:5173/register/${token}`);
        res.status(201).json({ message: "Invite created", token: invite.token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.inviteUser = inviteUser;
// --- 2️⃣ Register via Invite ---
const registerViaInvite = async (req, res) => {
    try {
        const { token, name, password } = req.body;
        // Find invite
        const invite = await Invite_model_1.Invite.findOne({ token });
        if (!invite)
            return res.status(400).json({ message: "Invalid invite token" });
        if (invite.acceptedAt)
            return res.status(400).json({ message: "Invite already used" });
        if (invite.expiresAt < new Date())
            return res.status(400).json({ message: "Invite expired" });
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = await User_model_1.User.create({
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
        const jwtToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(201).json({
            message: "User registered successfully",
            token: jwtToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.registerViaInvite = registerViaInvite;
// --- 3️⃣ Login ---
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User_model_1.User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        if (user.status !== "ACTIVE")
            return res.status(403).json({ message: "User inactive" });
        // Compare password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status } });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.loginUser = loginUser;
