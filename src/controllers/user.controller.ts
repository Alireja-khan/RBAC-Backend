import { Request, Response } from "express";
import { User } from "../models/User.model";

// GET users (paginated)
export const getUsers = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("-password")
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  res.json({ users, total, page, limit });
};

// UPDATE role
export const updateUserRole = async (req: Request, res: Response) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// UPDATE status
export const updateUserStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};
