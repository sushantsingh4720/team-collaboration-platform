const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [2, "Project name must be at least 2 characters long"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team ID is required"],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Project = model("Project", projectSchema);

module.exports = Project;
