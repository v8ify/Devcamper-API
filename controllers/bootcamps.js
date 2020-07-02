const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");
const errorResponse = require("../utils/ErrorResponse");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = async (req, res, next) => {
  // cloning req.query
  let queryObj = { ...req.query };

  // removing specific fields from query to deal with them in different manner
  let removedFields = ["select", "sort", "page", "limit"];
  removedFields.forEach(param => delete queryObj[param]);

  let queryStr = JSON.stringify(queryObj);

  // replacing (gt, gte) with ($gt, $gte) etc
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, match => `$${match}`);

  // getting specific fields from record
  let selectedParams = "";
  if (req.query.select) {
    selectedParams = req.query.select.split(",").join(" ");
  }

  // sorting params
  let sortBy = "";
  if (req.query.sort) {
    sortBy = req.query.sort.split(",").join(" ");
  } else {
    sortBy = "-createdAt";
  }

  // Skip
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 25;
  let itemsToSkip = (page - 1) * limit;
  let endIndex = page * limit;
  let total = await Bootcamp.countDocuments();

  // showing prev and next page numbers
  let pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (itemsToSkip > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  try {
    const bootcamps = await Bootcamp.find(JSON.parse(queryStr))
      .populate("courses")
      .select(`${selectedParams}`)
      .sort(sortBy)
      .skip(itemsToSkip)
      .limit(limit);
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps,
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new errorResponse(
          `Bootcamp with id ${req.params.id} does not exist`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};

// @desc      Create single bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};

// @desc      Update single bootcamps
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return next(
        new errorResponse(
          `Bootcamp with id ${req.params.id} does not exist`,
          404
        )
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete single bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new errorResponse(
          `Bootcamp with id ${req.params.id} does not exist`,
          404
        )
      );
    }

    bootcamp.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc      Get bootcamps within range
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampInRange = async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get location in long and lat
  const loc = await geocoder.geocode(zipcode);
  const long = loc[0].longitude;
  const lat = loc[0].latitude;

  // Calculate radius using radians
  // divide distance by radius of Earth
  // Radius of Earth = 6378 km
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
};
