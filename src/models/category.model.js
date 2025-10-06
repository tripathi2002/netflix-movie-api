const mongoose = require("mongoose");
const fs = require("fs");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "Category name is unique"],
    required: [true, "Category name is required field!"],
    minlength: [3, "Category name must not have less than 3 characters"],
    maxlength: [30, "Category name must not have more than 30 characters"],
    trim: true,
  },
  description: { type: String, trim: true },
  imageUrl: { type: String },
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: { type: Date, default: Date.now },
});

categorySchema.pre("save", function (next) {
  next();
});

categorySchema.post("save", function (doc, next) {
  const content = `a new category document with name ${doc.name} has been created at ${doc.createdAt}.\n`;
  fs.writeFileSync("./logs/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});

categorySchema.pre(/^find/, function (next) {
  this.startTime = Date.now();
  this.where({ status: true });
  next();
});

categorySchema.post(/^find/, function (doc, next) {
  this.endTime = Date.now();
  const content = `Query took ${
    this.endTime - this.startTime
  } milliseconds to fetch the documents (category).\n`;
  fs.writeFileSync("./logs/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});

const category = mongoose.model("Category", categorySchema);
module.exports = category;
