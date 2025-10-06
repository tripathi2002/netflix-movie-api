const mongoose = require("mongoose");
const fs = require("fs");
const validator = require("validator");

const supportedLanguages = [
  "English",
  "French",
  "Spanish",
  "Hindi",
  "Mandarin",
  "German",
  "Japanese",
  "Korean",
  "Others",
]; // Add supported languages here

const movieSchema = new mongoose.Schema(
  {
    // _id: {
    //     type: Number,
    //     required: true
    // },
    name: {
      type: String,
      required: [true, "Name is required field!"],
      unique: true,
      minlength: [4, "Movie name must not have less than 4 characters"],
      maxlength: [100, "Movie name must not have more than 100 characters"],
      trim: true,
      validator: [validator.isAlpha, "name should contain only alphabets"],
    },
    description: {
      type: String,
      required: [true, "description is required field!"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required field!"],
    },
    ratings: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 1 && value <= 10;
        },
        message: "rating ({VALUE}) should be below 10 and above 0",
      },
    },
    totalRating: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "releaseYear is required field!"],
    },
    releaseDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    genres: {
      type: [String],
      required: [true, "Genres is required field!"],
      enum: {
        values: [
          "Action",
          "Adventure",
          "Sci-Fi",
          "Thriller",
          "Crime",
          "Drama",
          "Romance",
          "Biography",
        ],
        message: "This genre does not exist",
      },
    },
    directors: {
      type: [String],
      required: [true, "Director is required field!"],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required field!"],
    },
    actors: {
      type: [String],
      required: [true, "Actors is required field!"],
    },
    price: {
      type: Number,
      required: [true, "Price is required field!"],
    },
    createdBy: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
      select: false,
    },
    trendingScore: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      required: [true, "Language is required field!"],
      enum: {
        values: supportedLanguages,
        message: "This Language is not supported",
      },
      default: "Hindi",
    },
    audioLanguages: {
      type: [String], // Array of supported audio languages for the movie
      default: ["Hindi"],
    },
    subtitles: [
      {
        language: { type: String, required: true },
        url: { type: String, required: true }, // Link to subtitle file
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

// EXECUTED BEFORE THE DOCUMENT IS SAVED IN DB
// .save() or .create()
// insertMany findByIdAndUpdate will not work
movieSchema.pre("save", function (next) {
  this.createdBy = "Vibhu Tripathi";
  // console.log(this);
  next();
});

movieSchema.post("save", function (doc, next) {
  const content = `a new movie document with name ${doc.name} has been created by ${doc.createdBy}.\n`;
  fs.writeFileSync("./logs/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});

// movieSchema.pre('find', function(next) {
//     this.find({ releaseDate: { $lte: Date.now() } });
//     next();
// });

// movieSchema.pre('findOne', function(next) {
//     this.find({ releaseDate: { $lte: Date.now() } });
//     next();
// });

// regular expresion mathod
movieSchema.pre(/^find/, function (next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.startTime = Date.now();
  this.where({ status: true });
  next();
});

movieSchema.post(/^find/, function (doc, next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.endTime = Date.now();

  const content = `Query took ${
    this.endTime - this.startTime
  } milliseconds to fetch the documents.\n`;
  fs.writeFileSync("./logs/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});

movieSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } });
  next();
});

const movie = mongoose.model("Movie", movieSchema);

module.exports = movie;
// module.exports = movieSchema;
