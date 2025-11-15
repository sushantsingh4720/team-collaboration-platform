const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      minlength: [1, "Message cannot be empty"],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team ID is required"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: [true, "Timestamp is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);

module.exports = Message;
