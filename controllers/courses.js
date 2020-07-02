const Course = require("../models/Course");
const geocoder = require("../utils/geocoder");
const errorResponse = require("../utils/ErrorResponse");
const Bootcamp = require("../models/Bootcamp");

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

// @desc      Get single courses by id
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new errorResponse(`Couldn't find course with id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// @desc      Add single course by bootcampId
// @route     POST /api/v1/bootcamp/:bootcampId/courses
// @access    Private
exports.createCourse = async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  try {
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      throw new errorResponse(
        `Couldn't find bootcamp with id ${req.params.bootcampId}`,
        400
      );
    }

    const course = await Course.create(req.body);

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};
