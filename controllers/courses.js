const Course = require("../models/Course");
const geocoder = require("../utils/geocoder");
const errorResponse = require("../utils/ErrorResponse");

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate("bootcamp", "name description");
  }

  try {
    const courses = await query.exec();
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    next(error);
  }
};
