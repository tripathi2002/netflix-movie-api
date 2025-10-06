const mongoose = require("mongoose");
const Movie = require("../models/movie.model");
const ApiFeatures = require("../utils/apiFeatures");
const CustomError = require("../utils/custom.error");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.checkId = (req, res, next, value) => {
  console.log("Movie ID is " + value);
  next();
};

//HIGHEST REATED MIDDLEWARE
exports.getHighestRated = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratings";
  next();
};

// Movie By Category MIDDLEWARE
exports.getMoviesByCategoryId = asyncErrorHandler(async (req, res, next) => {
    req.query.categories = req.params.category_id;

    next();
});

// ROUTE HANDLER FUNCTIONS
//GET ALL MOVIES
//GET::HOST:PORT/api/v2/movies?sort=duration,ratings&duration[lt]=117&fields=name,duration,price&page=2&limit=2
exports.getAllMovies = asyncErrorHandler(async (req, res) => {
  // try {
  const features = new ApiFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let movies = await features.query;

  return res.status(200).json({
    status: "success",
    size: movies.length,
    // page,
    movies,
  });
  /* // *****************only work mongoose 6.0 or less ****************
        const excludeFields = ['sort','page','limit','fields']; 
        const queryObj = {...req.query};

        excludeFields.forEach(el=>{
            delete queryObj[el];
        });

        // console.log(queryObj);
        const movies = await Movie.find(queryObj);
        ******************************************* */

  // // Method: 4th:-########## role1;
  // let queryStr = JSON.stringify(req.query);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // const queryObj = JSON.parse(queryStr);  //converting to js object
  // console.log("\nquery object::",queryObj);

  // const movies = await Movie.find(queryObj);
  // find({duration: {$gte:90}, ratings: {$lte:6}});

  // role2;

  // let query = Movie.find(queryObj);
  // SORTING LOGIC
  // if (req.query.sort) {
  //     // query = query.sort(req.query.sort);
  //     // console.log("\nquery sort:: ",req.query.sort)
  //     const sortBy = req.query.sort.split(',').join(' ');
  //     // console.log(sortBy)

  //     query = query.sort(sortBy);

  //     // query.sort('releaseYear ratings')
  // } else {
  //     query = query.sort('-createdAt');
  // }
  // role3;
  // // LIMITING FIELDS
  // if (req.query.fields) {
  //     // query = query.select('name duration price ratings');
  //     const fields = req.query.fields.split(',').join(' ');
  //     query = query.select(fields);
  // } else {
  //     query = query.select('-__v');
  // }
  //role4;
  // // PAGINATION
  // // query = query.skip(5).limit(5);

  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 5;
  // // PAGE 1: 1-5; PAGE 2: 6-10; PAGE 3: 11-15;
  // const skip = (page - 1) * limit;

  // query = query.skip(skip).limit(limit);

  // if (req.query.page) {
  //     const moviesCount = await Movie.countDocuments();
  //     if (skip >= moviesCount) {
  //         throw new Error("This page is not found");
  //     }
  // }

  // const movies = await query;

  // Method: 2st:-
  // const movies = await Movie.find({});
  // const movies = await Movies.find({duration: req.query.duration*1, ratings: +req.query.ratings});

  // Method: 3st:-
  // const movies = await Movie.find()
  //             .where('duration').equals(req.query.duration)
  //             .where('ratings').equals(req.query.ratings);

  // const movies = await Movie.find()
  //             .where('duration').gte(req.query.duration)
  //             .where('ratings').lte(req.query.ratings);
  // method 0th:-
  // const movies = await Movie.find();

  // res.status(200).json({
  //     status: "success",
  //     size: movies.length,
  //     // page,
  //     movies
  // });
  // } catch (error) {
  // console.log(error)
  // res.status(400).json({
  //     status: "fail",
  //     message: error.message
  // });
  //     next(error);
  // }
});

exports.getMovie = asyncErrorHandler(async (req, res, next) => {
  // try {
  // const movie = await Movie.findOne({_id: req.params.id});
  const movie = await Movie.findById({ _id: req.params.id });

  if (!movie) {
    const error = new CustomError(`Movie with ID is not found!`, 404);
    return next(error);
  }
  res.status(200).json({
    status: "success",
    movie,
  });
  // } catch (error) {
  // const err = new CustomeError(, 400);
  //     res.status(400).json({
  //         status: "fail",
  //         message: error
  //     });
  // }
});

exports.createMovie = asyncErrorHandler(async (req, res) => {
  // try {
  // const movie = await Movie.insertMany({_id:3,"name":"hindustan","releaseYear":2002,"duration":100});
  // console.log(req.body);

  // const movie = await Movie.insertMany(req.body);
  const movie = await Movie.create(req.body);

  res.status(200).json({
    status: "success",
    movie,
  });
  // } catch (error) {
  //     // const  err = new CustomError(error.message, 400);
  //     // res.status(400).json({
  //     //     status: "fail",
  //     //     message: error
  //     // });
  //     next(error)
  // }
});

exports.updateMovie = asyncErrorHandler(async (req, res, next) => {
  // try {
  const updatedMovie = await Movie.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  // runValidators check the schema validation
  // new return updated movie

  if (!updatedMovie) {
    const error = new CustomError("Movie with ID is not found!", 404);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      movie: updatedMovie,
    },
  });
  // } catch (error) {
  // res.status(404).json({
  //     status: "fail",
  //     message: error.message
  // });
  // }
});

exports.deleteMovie = asyncErrorHandler(async (req, res, next) => {
  // try {
  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

  if (!deletedMovie) {
    const error = new CustomError("Movie with ID is not found!", 404);
    return next(error);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });

  // } catch (error) {
  // res.send(404).json({
  //     status: "fail",
  //     message: error.message
  // });
  // }
});

exports.getMovieStats = asyncErrorHandler(async (req, res) => {
  // try {
  const stats = await Movie.aggregate([
    { $match: { ratings: { $gte: 4.5 } } },
    {
      $group: {
        // _id: null,
        _id: "$releaseYear",
        avgRating: { $avg: "$ratings" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        priceTotal: { $sum: "$price" },
        movieCount: { $sum: 1 },
      },
    },
    { $sort: { minPrice: -1 } },
    { $match: { maxPrice: { $gte: 50 } } },
  ]);

  res.status(200).json({
    status: "success",
    count: stats.length,
    data: {
      stats,
    },
  });

  // } catch (error) {
  // res.status(404).json({
  //     status: "fail",
  //     message: error.message
  // });
  // }
});

exports.getMovieByGenre = asyncErrorHandler(async (req, res) => {
  // try {
  const genre = req.params.genre;
  const movies = await Movie.aggregate([
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        movieCount: { $sum: 1 },
        movies: { $push: "$name" },
      },
    },
    { $addFields: { genre: "$_id" } },
    { $project: { _id: 0 } },
    { $sort: { movieCount: -1 } },
    // { $limit: 2},
    { $match: { genre: genre } },
  ]);

  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies,
    },
  });

  // } catch (error) {
  // res.status(404).json({
  //     status: "fail",
  //     message: error.message
  // });
  // }
});

exports.getSimilarMovies = asyncErrorHandler(async (req, res, next) => {
  const movieId = req.params.movie_id;

  // Get the base movie document
  const baseMovie = await Movie.findById(movieId).select('genres directors categories').lean();

  if (!baseMovie) {
    return res.status(404).json({
      status: 'fail',
      message: 'Movie not found'
    });
  }

  const similarQuery = Movie.find({
    _id: { $ne: mongoose.Types.ObjectId(movieId) }, // exclude current movie
    $or: [
      { genres: { $in: baseMovie.genres } },
      { directors: { $in: baseMovie.directors } },
      { categories: { $in: baseMovie.categories } }
    ]
  });

  // You can add sorting, limiting results
  const similarMovies = await similarQuery.limit(10);

  res.status(200).json({
    status: 'success',
    results: similarMovies.length,
    similarMovies,
  });
});
