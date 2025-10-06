/* #43 - creating & using routes module 
*****************************************
*/
const express = require('express');
const moviesController = require('./../controllers/movies.controller');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const { protect, restrict } = require('./../controllers/auth.controller');

const router = express.Router();

// router.param('id', moviesController.checkId);

router.route('/highest-rated').get(moviesController.getHighestRated,moviesController.getAllMovies)

router.route('/movie-stats').get(moviesController.getMovieStats)
router.route('/movie-by-genre/:genre').get(moviesController.getMovieByGenre);
router.route('/movie-by-category/:category_id')
                .get(moviesController.getMoviesByCategoryId, moviesController.getAllMovies)
router.route('/movie-by-similarity/:movie_id')
                .get(moviesController.getSimilarMovies)

router.route('/')
                // .get(asyncErrorHandler( moviesController.getAllMovies))  // it's work same 
                .get(protect, moviesController.getAllMovies)
                .post(protect, moviesController.createMovie)


router.route('/:id')
                .get(moviesController.getMovie)
                .patch(protect, moviesController.updateMovie)
                .delete(protect, restrict('admin'), moviesController.deleteMovie)

module.exports = router;