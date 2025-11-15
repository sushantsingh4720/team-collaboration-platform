const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Task title must be at least 2 characters long"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "done"],
        message: "Status must be one of: todo, in-progress, done",
      },
      default: "todo",
      required: [true, "Task status is required"],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Task = model("Task", taskSchema);

module.exports = Task;
