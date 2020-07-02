const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config({ path: "./config/config.env" });

const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Load bootcamps from _data/bootcamps.js
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// Load course from _data/courses.js
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const insertData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log("Data inserted...".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
  }
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
