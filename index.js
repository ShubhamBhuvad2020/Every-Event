const express = require("express");
const dotenv = require("dotenv");
// const morgan = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");
const connectDB = require("./server/database/connection");

const EventDB = require("./server/models/model");
const app = express();

// config env file
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

// mongodb Connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(bodyparser.json());

// set view engine
app.set("view engine", "ejs");

// load public files
app.use("/css", express.static(path.resolve(__dirname, "public/css")));
app.use("/js", express.static(path.resolve(__dirname, "public/js")));

// load routers
app.use("/", require("./server/routes/router"));

// call localhost
app.listen(PORT, () => {
  console.log(`Server running at port http://localhost:${PORT}`);
});
