"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.updateUserRole = exports.getUsers = void 0;
const User_model_1 = require("../models/User.model");
// GET users (paginated)
const getUsers = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await User_model_1.User.find()
        .select("-password")
        .skip(skip)
        .limit(limit);
    const total = await User_model_1.User.countDocuments();
    res.json({ users, total, page, limit });
};
exports.getUsers = getUsers;
// UPDATE role
const updateUserRole = async (req, res) => {
    const { role } = req.body;
    const user = await User_model_1.User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
};
exports.updateUserRole = updateUserRole;
// UPDATE status
const updateUserStatus = async (req, res) => {
    const { status } = req.body;
    const user = await User_model_1.User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select("-password");
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
};
exports.updateUserStatus = updateUserStatus;
