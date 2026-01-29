import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/User.model"; // adjust path if needed

dotenv.config();

mongoose.connect(process.env.MONGO_URI as string)
  .then(async () => {
    const hashedPassword = bcrypt.hashSync("admin123", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE"
    });

    console.log("Admin created:", admin);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
