"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// models/User.model.ts
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "MANAGER", "STAFF"], default: "STAFF" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    invitedAt: Date,
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
