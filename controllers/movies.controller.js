const Movie = require('./database.controller');
const ApiFeatures = require('../utils/apiFeatures')

exports.checkId = (req, res, next, value) => {
    console.log('Movie ID is ' + value);
    next();
}

//HIGHEST REATED MIDDLEWARE 
exports.getHighestRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratings';
    next();
}

// ROUTE HANDLER FUNCTIONS
//GET ALL MOVIES 
//GET::HOST:PORT/api/v2/movies?sort=duration,ratings&duration[lt]=117&fields=name,duration,price&page=2&limit=2
exports.getAllMovies = async (req, res) => {
    try {

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
            movies
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
    } catch (error) {
        // console.log(error)
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.getMovie = async (req, res) => {

    try {
        // const movie = await Movie.findOne({_id: req.params.id});
        const movie = await Movie.findById({ _id: req.params.id });

        res.status(200).json({
            status: "success",
            movie
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        });
    }
}

exports.createMovie = async (req, res) => {
    try {
        // const movie = await Movie.insertMany({_id:3,"name":"hindustan","releaseYear":2002,"duration":100});
        // console.log(req.body);         

        const movie = await Movie.insertMany(req.body);

        res.status(200).json({
            status: "success",
            movie
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        });
    }
}

exports.updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
        // runValidators check the schema validation 
        // new return updated movie
        res.status(200).json({
            status: "success",
            data: {
                movie: updatedMovie
            }
        })
    } catch (error) {
        res.send(404).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.deleteMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            data: null
        });

    } catch (error) {
        res.send(404).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.getMovieStats = async (req, res) => {
    try {
        const stats = await Movie.aggregate([
            { $match: { ratings: { $gte: 4.5 } } },
            {
                $group: {
                    // _id: null,
                    _id: '$releaseYear',
                    avgRating: { $avg: '$ratings' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    priceTotal: { $sum: '$price' },
                    movieCount: { $sum: 1 },
                },
            },
            { $sort: { minPrice: -1 } },
            { $match: { maxPrice: { $gte: 50 } } }
        ])

        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {
                stats
            }
        })

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.getMovieByGenre = async (req, res) => {
    try {
        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            { $unwind: '$genres' },
            {
                $group: {
                    _id: '$genres',
                    movieCount: { $sum: 1 },
                    movies: { $push: '$name' },
                }
            },
            { $addFields: { genre: '$_id' } },
            { $project: { _id: 0 } },
            { $sort: { movieCount: -1 } },
            // { $limit: 2},
            { $match: { genre: genre } }

        ])

        res.status(200).json({
            status: "success",
            count: movies.length,
            data: {
                movies
            }
        });

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
}