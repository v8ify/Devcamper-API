const errorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(err.stack.red);

  if (err.name === "CastError") {
    let message = `Resource with id ${error.value} not found.`;
    error = new errorResponse(message, 404);
  }

  if (err.code === 11000) {
    let message = `Duplicate values entered`;
    error = new errorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    let message = Object.values(err.errors).map(val => val.message);
    error = new errorResponse(message, 400);
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server error" });
};

module.exports = errorHandler;
