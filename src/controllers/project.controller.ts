import { Request, Response } from "express";
import { Project } from "../models/Project.model";

// CREATE project
export const createProject = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const project = await Project.create({
    ...req.body,
    createdBy: req.user.id,
  });

  const populatedProject = await Project.findById(project._id).populate('createdBy', 'name email role');

  res.status(201).json(populatedProject);
};


// GET projects (exclude soft deleted)
export const getProjects = async (_: Request, res: Response) => {
  const projects = await Project.find({ isDeleted: false })
    .populate("createdBy", "name email role");

  res.json(projects);
};

// UPDATE project (ADMIN)
export const updateProject = async (req: Request, res: Response) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).populate('createdBy', 'name email role');

  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
};

// SOFT DELETE project (ADMIN)
export const deleteProject = async (req: Request, res: Response) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, status: "DELETED" },
    { new: true }
  );

  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project soft deleted" });
};
