"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invite = void 0;
// models/Invite.model.ts
const mongoose_1 = require("mongoose");
const inviteSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "MANAGER", "STAFF"], required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: Date,
});
exports.Invite = (0, mongoose_1.model)("Invite", inviteSchema);
