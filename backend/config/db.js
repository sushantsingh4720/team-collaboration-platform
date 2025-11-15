const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.set("runValidators", true);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Handle mongoose connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Gracefully close connection on app termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to app termination");
  process.exit(0);
});

module.exports = connectDB;
