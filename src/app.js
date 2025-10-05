// IMPORT PACKAGE
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const moviesRouter = require("./routes/movies.routes");
const authRouter = require("./routes/auth.router");
const CustomError = require("./utils/custom.error");
const globalErrorHandler = require("./controllers/error.controller");

let app = express();

let limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many requests from this IP. Please try after one hour.",
});

app.use("/api", limiter);

app.use(express.json());

app.use(morgan("dev")); //calling morgan function

app.use(express.static("./public")); //creating route for static folder for acces files on there
app.use((req, res, next) => {
  // req.requestedAt = new Date().toISOString();
  req.requestedAt = new Date().toDateString();
  next();
});

// app.get('/', async (req, res) => {
//     return res.status(200).json({status: 200, message: "server up and running..."})
// })

// USING ROUTES
app.use("/api/v2/movies", moviesRouter); // calling moviesRouter middleware
app.use("/api/v2/users", authRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //     status: "fail",
  //     message: `Can't find ${req.url} on the server`
  // });
  // const err = new Error(`Can't find ${req.url} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  const err = new CustomError(`Can't find ${req.url} on the server`, 404);
  next(err); // if next(100) or any other value express will assume it an err and pass it to global error handler
});

app.use(globalErrorHandler);
// EXPORTING APP OBJECT
module.exports = app;
