const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
// Initialize slug
mongoose.plugin(slug);

var eventSchema = new mongoose.Schema({
  Ename: {
    type: String,
    require: true,
    trim: true,
  },
  Edate: {
    type: Date,
    require: true,
  },
  starttime: {
    type: String,
    require: true,
  },
  endtime: {
    type: String,
    require: true,
  },
  hostname: {
    type: String,
    require: true,
    trim: true,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
});

var attendanceSchema = new mongoose.Schema({
  Eid: {
    type: String,
    require: true,
  },
  EmpId: {
    type: String,
    require: true,
    trim: true,
  },
  EmpName: {
    type: String,
    require: true,
    trim: true,
  },
  EmpEmail: {
    type: String,
    require: true,
    trim: true,
  },
  EmpUnit: {
    type: String,
    require: true,
  },
  EmpPlatform: {
    type: String,
    require: true,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
});

const EventDB = mongoose.model("event", eventSchema);
const AttendanceDB = mongoose.model("attendanced", attendanceSchema);
module.exports = { EventDB, AttendanceDB };
