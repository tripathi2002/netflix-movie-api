const express = require("express");

const homeController = require("./../controllers/home.controller");
const moviesController = require("./../controllers/movies.controller");

const router = express.Router();

router
  .route("/trending-movies")
  .get(homeController.trendingMovies, moviesController.getAllMovies);
router
  .route("/movies/")
  .get(homeController.trendingMovies, moviesController.getAllMovies);

module.exports = router;
