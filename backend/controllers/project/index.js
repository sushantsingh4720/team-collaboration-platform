const Project = require("../../models/project");
const Task = require("../../models/task");
const Team = require("../../models/team");
const { createProjectValidation } = require("../../utils/validations/project");

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ teamId: req.user.teamId }).populate(
      "teamId",
      "name"
    );

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { error, value } = createProjectValidation({
      ...req.body,
      teamId: req.user.teamId?.toString(),
    });

    const { name, description, teamId } = value;
    if (error) {
      return res.status(400).json({
        succcess: true,
        error: error.details[0].message,
      });
    }

    const team = await Team.findOne({
      _id: req.user.teamId,
      $or: [
        { adminId: req.user._id },
        { _id: req.user.teamId, members: req.user._id },
      ],
    });

    if (!team) {
      return res.status(400).json({
        error: "Not authorized to create projects for this team",
      });
    }

    const project = await Project.create({ name, description, teamId });

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { error, value } = createProjectValidation({
      ...req.body,
      teamId: req.user.teamId?.toString(),
    });

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      teamId: req.user.teamId,
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    Object.assign(project, req.body);
    await project.save();

    res.json(project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      teamId: req.user.teamId,
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    // Delete associated tasks
    await Task.deleteMany({ projectId: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
