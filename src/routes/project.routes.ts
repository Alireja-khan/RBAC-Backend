import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { createProject, getProjects, updateProject, deleteProject } from "../controllers/project.controller";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.patch("/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateProject);
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteProject);

export default router;
