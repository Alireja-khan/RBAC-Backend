import { Router } from "express";
import { inviteUser, registerViaInvite, loginUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Admin creates invite
router.post("/invite", authMiddleware, roleMiddleware(["ADMIN"]), inviteUser);

// User registers via invite token
router.post("/register-via-invite", registerViaInvite);

// User login
router.post("/login", loginUser);

export default router;
