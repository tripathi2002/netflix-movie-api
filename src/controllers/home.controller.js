const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/custom.error");

const createSendResponse = (user, statusCode, res) => {
  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.trendingMovies = asyncErrorHandler(async (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-trendingScore';
    next();
});
