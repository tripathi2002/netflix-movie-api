/* #43 - creating & using routes module 
*****************************************
*/
const express = require('express');
const moviesController = require('./../controllers/movies.controller');

const router = express.Router();

// router.param('id', moviesController.checkId);

router.route('/highest-rated').get(moviesController.getHighestRated,moviesController.getAllMovies)

router.route('/')
                .get(moviesController.getAllMovies)
                .post(moviesController.createMovie)

router.route('/:id')
                .get(moviesController.getMovie)
                .patch(moviesController.updateMovie)
                .delete(moviesController.deleteMovie)

module.exports = router;