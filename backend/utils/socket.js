// /utils/socket.js
const { Server } = require("socket.io");

const setupSocketIO = (server) => {
  console.log(process.env.CLIENT_URL);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // Join a team room
    socket.on("join_team", ({ teamId, userEmail }) => {
      if (!teamId) return;

      socket.join(teamId);
      socket.teamId = teamId;
      socket.userEmail = userEmail || "unknown";

      console.log(`${socket.userEmail} joined team ${teamId}`);
      socket.emit("connected", "Joined team");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  console.log("Socket.io ready");
  return io;
};

module.exports = { setupSocketIO };
