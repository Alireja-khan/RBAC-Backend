// models/Project.model.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  status: "ACTIVE" | "ARCHIVED" | "DELETED";
  isDeleted: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["ACTIVE", "ARCHIVED", "DELETED"], default: "ACTIVE" },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);
