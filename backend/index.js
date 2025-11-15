const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { setupSocketIO } = require("./utils/socket");
const http = require("http");
const apiRouter = require("./routers");
const error = require("./middlewares/error");
const ip = require("./middlewares/ip");

config();
connectDB();

const app = express();

const server = http.createServer(app);

// Setup Socket.io
const io = setupSocketIO(server);

// Make io available to routes if needed
app.set("io", io);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(ip);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real-time team collaboration platform api is working",
  });
});

app.use("/api", apiRouter);

app.use(error);

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Socket.io server is running`);
});
