"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
// models/Project.model.ts
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["ACTIVE", "ARCHIVED", "DELETED"], default: "ACTIVE" },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
exports.Project = (0, mongoose_1.model)("Project", projectSchema);
