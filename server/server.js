import mongoose from "mongoose";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { ENV } from "./src/config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server Error:", error.message);

      if (error.code === "EADDRINUSE") {
        console.error(`Port ${ENV.PORT} is already in use.`);
      }

      process.exit(1);
    });

    const shutdown = async () => {
      console.log("\n Shutting down...");

      try {
        server.close(() => {
          console.log("HTTP server closed.");

          mongoose.connection.close(false, () => {
            console.log("MongoDB connection closed.");
            process.exit(0);
          });
        });
      } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Promise Rejection:", reason);
      shutdown();
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      shutdown();
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
