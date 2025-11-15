const { Schema, model } = require("mongoose");

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [2, "Team name must be at least 2 characters long"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin ID is required"],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Team = model("Team", teamSchema);

module.exports = Team;
