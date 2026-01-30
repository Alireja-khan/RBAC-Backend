"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjects = exports.createProject = void 0;
const Project_model_1 = require("../models/Project.model");
// CREATE project
const createProject = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const project = await Project_model_1.Project.create({
        ...req.body,
        createdBy: req.user.id,
    });
    const populatedProject = await Project_model_1.Project.findById(project._id).populate('createdBy', 'name email role');
    res.status(201).json(populatedProject);
};
exports.createProject = createProject;
// GET projects (exclude soft deleted)
const getProjects = async (_, res) => {
    const projects = await Project_model_1.Project.find({ isDeleted: false })
        .populate("createdBy", "name email role");
    res.json(projects);
};
exports.getProjects = getProjects;
// UPDATE project (ADMIN)
const updateProject = async (req, res) => {
    const project = await Project_model_1.Project.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('createdBy', 'name email role');
    if (!project)
        return res.status(404).json({ message: "Project not found" });
    res.json(project);
};
exports.updateProject = updateProject;
// SOFT DELETE project (ADMIN)
const deleteProject = async (req, res) => {
    const project = await Project_model_1.Project.findByIdAndUpdate(req.params.id, { isDeleted: true, status: "DELETED" }, { new: true });
    if (!project)
        return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project soft deleted" });
};
exports.deleteProject = deleteProject;
