"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_model_1 = require("../models/User.model"); // adjust path if needed
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(async () => {
    const hashedPassword = bcryptjs_1.default.hashSync("admin123", 10);
    const admin = await User_model_1.User.create({
        name: "Super Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
        status: "ACTIVE"
    });
    console.log("Admin created:", admin);
    mongoose_1.default.disconnect();
})
    .catch(err => console.error(err));
