const { render } = require("ejs");
const { json } = require("express");
const express = require("express");
const moment = require("moment");
// const mixitup = require("mixitup");
const { to24Hours, to12Hours } = require("convert-string-time");
const route = express.Router();
const { EventDB, AttendanceDB } = require("../models/model");

// get login route
route.get("/", (req, res) => {
  res.render("AdminLogin");
});
// post login route
route.post("/", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username == process.env.User && password == process.env.Password) {
    res.redirect("/home");
  } else {
    res.redirect("/");
  }
});
// get logout route
route.get("/logout", (req, res) => {
  res.redirect("/");
});
// get Home route
route.get("/home", (req, res) => {
  EventDB.find((err, event) => {
    if (!err) {
      res.render("Home", {
        data: event,
        moment: moment,
        to12Hours: to12Hours,
      });
      // console.log(typeof to12Hours("23:00"));
      // res.render("Events", { data: event });
    } else {
      res.send("Data Not Found!");
    }
  });
  // res.render("Home");
});

//  get Events route
route.get("/events", (req, res) => {
  EventDB.find((err, event) => {
    if (!err) {
      res.render("Events", {
        data: event,
        moment: moment,
        to12Hours: to12Hours,
      });
      // console.log(typeof to12Hours("23:00"));
      // res.render("Events", { data: event });
    } else {
      res.send("Data Not Found!");
    }
  });
  // res.render("Events");
});
// get add event route
route.get("/addEvent", (req, res) => {
  res.render("AddEvents", { AlreadySaved: false });
});
// post event to database
route.post("/postEvent", (req, res) => {
  // Validate Data
  const Data = new EventDB({
    Ename: req.body.eName,
    Edate: req.body.eDate,
    starttime: req.body.eStart,
    endtime: req.body.eEnd,
    hostname: req.body.eHostName,
  });
  // Redirect Data to events page
  // Data.save();
  // res.redirect("/events");
  EventDB.findOne({ name: req.body.eName }, (err, eventDetails) => {
    // console.log(req.body.eName.trim().length);
    console.log(eventDetails);
    if (!err) {
      if (req.body.eName.trim() == eventDetails.Ename) {
        res.render("AddEvents", { AlreadySaved: true });
        // res.send("Event is already present");
      } else {
        Data.save();
        res.redirect("/events");
      }
    }
  });
});
// get attendance event route
route.get("/attendance/:id", (req, res) => {
  // res.send("Attedndance Form here");
  EventDB.findOne({ _id: req.params.id }, (err, eventDetail) => {
    if (!err) {
      res.render("Attendance", {
        event: eventDetail,
        moment: moment,
        to12Hours: to12Hours,
      });
    } else {
      res.send("Data not found!");
    }
  });
  // res.send(req.params.id);
});
// post attendance event route
route.post("/attendance/:id", (req, res) => {
  // not checking data in database
  const EmpAttendance = new AttendanceDB({
    Eid: req.params.id,
    EmpId: req.body.empid,
    EmpName: req.body.empname,
    EmpEmail: req.body.empemail,
    EmpUnit: req.body.unit,
    EmpPlatform: req.body.platform,
  });
  EmpAttendance.save();
  res.render("Message", { name: req.body.empname, flag: true });
  // checking data in database
  // EventDB.findOne({ _id: req.params.id }, (err, eventDetail) => {
  //   if (!err) {
  //     const EmpAttendance = new AttendanceDB({
  //       Eid: req.params.id,
  //       EmpId: req.body.empid,
  //       EmpName: req.body.empname,
  //       EmpEmail: req.body.empemail,
  //       EmpUnit: req.body.unit,
  //       EmpPlatform: req.body.platform,
  //     });
  //     ///
  //     AttendanceDB.findOne((err, attendanceDetails) => {
  //       // console.log(req.body.empid, attendanceDetails.EmpId);
  //       if (!err) {
  //         if (req.body.empid == attendanceDetails.EmpId) {
  //           res.render("Message", { name: req.body.empname, flag: false });
  //           // res.send("record is already present");
  //         } else {
  //           EmpAttendance.save((err) => {
  //             if (!err) {
  //               res.render("Message", { name: req.body.empname, flag: true });
  //             }
  //           });
  //         }
  //       }
  //     });
  //   } else {
  //     res.send("Data not found!");
  //   }
  // });
});
// Delete Event route
route.get("/attendance/delete/:id", (req, res) => {
  EventDB.deleteOne({ _id: req.params.id }, (err, deleteEvent) => {
    res.redirect("/events");
  });
});
// Get Event Details
route.get("/EventDetails/:id", (req, res) => {
  EventDB.findOne({ _id: req.params.id }, (err, eventDetails) => {
    if (!err) {
      AttendanceDB.find((err, EmpDetails) => {
        if (!err) {
          res.render("EventDetails", {
            event: eventDetails,
            emp: EmpDetails,
            moment: moment,
            to12Hours: to12Hours,
          });
        }
      });
    }
  });
  // res.render("EventDetails");
  // res.send("Load Page Here");
});
// invalid route
route.get("*", (req, res) => {
  res.render("Page_404");
});

module.exports = route;
