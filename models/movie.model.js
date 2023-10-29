const mongoose = require('mongoose');
const fs = require('fs');

const movieSchema = new mongoose.Schema({
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
    },
    createdBy: {
        type: String,
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

movieSchema.virtual('durationInHours').get(function() {
    return this.duration / 60;
});

// EXECUTED BEFORE THE DOCUMENT IS SAVED IN DB 
// .save() or .create() 
// insertMany findByIdAndUpdate will not work
movieSchema.pre('save', function(next) {
    this.createdBy = 'Vibhu Tripathi'
    // console.log(this);
    next();
});

movieSchema.post('save', function(doc, next) {
    const content = `a new movie document with name ${doc.name} has been created by ${doc.createdBy}.\n`;
    fs.writeFileSync('./log/log.txt', content, { flag: 'a' }, (err) => {
        console.log(err.message);
    })
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
movieSchema.pre(/^find/, function(next) {
    this.find({ releaseDate: { $lte: Date.now() } });
    this.startTime = Date.now();
    next();
});

movieSchema.post(/^find/, function(doc, next) {
    this.find({ releaseDate: { $lte: Date.now() } });
    this.endTime = Date.now();

    const content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the documents.\n`;
    fs.writeFileSync('./log/log.txt', content, {flag: 'a'}, (err)=>{
        console.log(err.message);
    });
    next();
});

movieSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match: { releaseDate: {$lte: new Date()}}});
    next();
});

module.exports = movieSchema;
