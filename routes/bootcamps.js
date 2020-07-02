const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRange,
} = require("../controllers/bootcamps");

// Load other resource router
const courseRouter = require("./courses");

const router = express.Router();

// Redirect to courseRouter at /routes/courses.js
router.use("/:bootcampId/courses", courseRouter);

// requests to route /api/v1/bootcamps/
router.route("/radius/:zipcode/:distance").get(getBootcampInRange);

// requests to route /api/v1/bootcamps
router.route("/").get(getBootcamps).post(createBootcamp);

// requests to route /api/v1/bootcamps/:id
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
