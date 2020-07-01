const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");

// Error handler middleware
const errorHandler = require("./middleware/errorHandler");

// Database initialization function
const connect = require("./config/db");

// Load routers
const bootcamps = require("./routes/bootcamps");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Bodyparser middleware
app.use(express.json());

// Database initialized
connect();

// Logger middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Manage unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  // Exit app after unhandled rejection
  server.close(() => process.exit(1));
});
