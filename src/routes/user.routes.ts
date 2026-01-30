import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { getUsers, updateUserRole, updateUserStatus } from "../controllers/user.controller";

const router = Router();

router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getUsers);
router.patch("/:id/role", authMiddleware, roleMiddleware(["ADMIN"]), updateUserRole);
router.patch("/:id/status", authMiddleware, roleMiddleware(["ADMIN"]), updateUserStatus);

export default router;
