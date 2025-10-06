const Category = require("../models/category.model");
const ApiFeatures = require("../utils/apiFeatures");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.getAllCategories = asyncErrorHandler(async (req, res) => {
  const features = new ApiFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  let categories = await features.query;

  return res.status(200).json({
    status: "success",
    size: categories.length,
    categories,
  });
});
