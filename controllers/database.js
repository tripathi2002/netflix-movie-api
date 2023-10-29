// // connecting to database
const mongoose = require('mongoose');
const movieModel = require('./../models/movieModel');
// const Movie = require('./../models/movieModel');

mongoose.connect("mongodb://127.0.0.1:2000/netflix")
    .then((conn) => {
        console.log("connected to database...");
    }
    ).catch(err => {
        console.log("some error hass occured");
    });

const movie = mongoose.model('Movie', movieModel.schema);

module.exports = movie



// const moviesschema = new mongoose.Schema({
//     // _id: { 
//     //     type: Number,
//     //     required: true
//     // },
//     name: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true
//     },
//     description: {
//         type: String,
//         required: [true, "description is required field!"],
//         trim: true
//     },
//     duration: {
//         type: Number,
//         required: [true, 'Duration is required field!']
//     },
//     ratings: {
//         type: Number,
//         // default: 1.0
//     },
//     totalRating: {
//         type: Number
//     },
//     releaseYear: {
//         type: Number,
//         required: [true, 'releaseYear is required field!']
//     },
//     releaseDate: {
//         type: Date
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now()
//     },
//     genres: {
//         type: [String],
//         required: [true, 'Genres is required field!']
//     },
//     directors: {
//         type: [String],
//         required: [true, 'Director is required field!']
//     },
//     coverImage: {
//         type: String,
//         required: [true, 'Cover image is required field!']
//     },
//     actors: {
//         type: [String],
//         required: [true, 'Actors is required field!']
//     },
//     price: {
//         type: Number,
//         required: [true, 'Price is required field!']
//     }
// });

// const movie = mongoose.model('Movie', moviesschema);

// const testMovie = new movie({
//     name: "Die hard",
//     description: "Action packed movie starting bruce willis in this trilling adventure.",
//     releaseYear: 2002,
//     duration: 138,
//     ratings: 4.5,
// });

// testMovie.save().then(doc=>{
//     console.log(doc);
// }).catch(err=>{
//     console.log("error occured!" + err);
// });

// module.exports = movie