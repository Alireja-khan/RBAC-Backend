import { IUser } from "../models/User.model";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "ADMIN" | "MANAGER" | "STAFF";
      };
    }
  }
}
