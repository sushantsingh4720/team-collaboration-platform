const Message = require("../../models/message");
const createMessageValidation = require("../../utils/validations/message");

const getMessages = async (req, res, next) => {
  try {
    const { teamId } = req.query;

    if (!teamId) {
      return res.status(400).json({
        error: "teamId query parameter is required",
      });
    }

    if (teamId !== req.user.teamId.toString()) {
      return res.status(400).json({
        error: "Not authorized to view messages from this team",
      });
    }

    const messages = await Message.find({ teamId })
      .populate("senderId", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    // Transform the data to your desired format
    const formattedMessages = messages.reverse().map((message) => ({
      _id: message._id,
      content: message.content,
      senderId: message.senderId._id,
      teamId: message.teamId,
      sender: {
        name: message.senderId.name,
        email: message.senderId.email,
      },
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }));

    res.json(formattedMessages);
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { error, value } = createMessageValidation({
      ...req.body,
      senderId: req.user._id?.toString(),
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    if (req.body.teamId !== req.user.teamId.toString()) {
      return res.status(403).json({
        message: "Not authorized to send messages to this team",
      });
    }

    const { content, teamId } = value;
    const message = new Message({
      content,
      teamId,
      senderId: req.user._id,
    });

    await message.save();
    await message.populate("senderId", "name email");

    const formattedMessage = {
      _id: message._id,
      content: message.content,
      senderId: message.senderId._id,
      teamId: message.teamId,
      sender: {
        name: message.senderId.name,
        email: message.senderId.email,
      },
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };

    const io = req.app.get("io");

    io.to(teamId).emit("new_message", formattedMessage);

    res.status(200).json(formattedMessage);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, sendMessage };
