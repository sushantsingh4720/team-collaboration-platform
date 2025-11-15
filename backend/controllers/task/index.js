const Project = require("../../models/project");
const Task = require("../../models/task");
const createTaskValidation = require("../../utils/validations/task");

const getTasks = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      teamId: req.user.teamId,
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("projectId", "name")
      .lean(); // Convert to plain JavaScript objects

    // Transform the tasks to match your desired format
    const formattedTasks = tasks.map((task) => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      projectId: task.projectId?._id || task.projectId,
      assignedTo: task.assignedTo?._id || task.assignedTo,
      assignedUser: task.assignedTo, // This will contain the populated user data (name, email)
      project: task.projectId, // This will contain the populated project data (name)
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    res.json(formattedTasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { error } = createTaskValidation(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const project = await Project.findOne({
      _id: req.body.projectId,
      teamId: req.user.teamId,
    });

    if (!project) {
      return res.status(400).json({
        error: "Not authorized to create tasks for this project",
      });
    }

    const task = new Task(req.body);
    await task.save();

    // Recommended: populate with an array in a single call
    await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "projectId", select: "name" },
    ]);

    // Normalize output to match frontend Task interface
    const formattedTask = {
      _id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      projectId:
        task.projectId?._id?.toString() || task.projectId?.toString() || null,
      assignedTo:
        task.assignedTo?._id?.toString() || task.assignedTo?.toString() || null,
      assignedUser: task.assignedTo
        ? {
            _id: task.assignedTo._id.toString(),
            name: task.assignedTo.name,
            email: task.assignedTo.email,
          }
        : null,
      project: task.projectId
        ? {
            _id: task.projectId._id.toString(),
            name: task.projectId.name,
          }
        : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    res.status(201).json(formattedTask);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { error } = createTaskValidation(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const task = await Task.findById(req.params.id).populate({
      path: "projectId",
      match: { teamId: req.user.teamId },
    });

    if (!task || !task.projectId) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    Object.assign(task, req.body);
    await task.save();
    await task.populate("assignedTo", "name email");

    // Normalize output to match frontend Task interface
    const formattedTask = {
      _id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      projectId:
        task.projectId?._id?.toString() || task.projectId?.toString() || null,
      assignedTo:
        task.assignedTo?._id?.toString() || task.assignedTo?.toString() || null,
      assignedUser: task.assignedTo
        ? {
            _id: task.assignedTo._id.toString(),
            name: task.assignedTo.name,
            email: task.assignedTo.email,
          }
        : null,
      project: task.projectId
        ? {
            _id: task.projectId._id.toString(),
            name: task.projectId.name,
          }
        : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
    res.json(formattedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate({
      path: "projectId",
      match: { teamId: req.user.teamId },
    });

    if (!task || !task.projectId) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
