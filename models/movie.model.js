const mongoose = require('mongoose');


// const moviesSchema = new mongoose.Schema({
exports.schema = new mongoose.Schema({
    // _id: { 
    //     type: Number,
    //     required: true
    // },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "description is required field!"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required field!']
    },
    ratings: {
        type: Number,
        // default: 1.0
    },
    totalRating: {
        type: Number,

    },
    releaseYear: {
        type: Number,
        required: [true, 'releaseYear is required field!']
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    genres: {
        type: [String],
        required: [true, 'Genres is required field!']
    },
    directors: {
        type: [String],
        required: [true, 'Director is required field!']
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required field!']
    },
    actors: {
        type: [String],
        required: [true, 'Actors is required field!']
    },
    price: {
        type: Number,
        required: [true, 'Price is required field!']
    }
})

// module.exports = moviesSchema;

// const movie = mongoose.model('Movie', moviesSchema);

// module.exports = {moviesSchema, movie};
// module.exports = movie;