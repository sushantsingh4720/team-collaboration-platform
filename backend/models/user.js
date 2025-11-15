const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    role: {
      type: String,
      enum: {
        values: ["ADMIN", "MANAGER", "MEMBER"],
        message: "Role must be ADMIN, MANAGER, or MEMBER",
      },
      default: "MEMBER",
      required: [true, "Role is required"],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
