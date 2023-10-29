// run this file from root directory  where is the config.env file persent 
// run commond :: for import  ::: node ./data/import-dev-data.js --import
// run commond :: for delete  ::: node ./data/import-dev-data.js --delete
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

// const Movie = require('./../models/movieModel');
const model = require('./../models/movieModel');

dotenv.config({path: './config.env'});

// CONNECT TO MONGODB 
// mongoose.connect("mongodb://127.0.0.1:2000/netflix", {
mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then(conn=>{
    console.log('DB Connection Successful');
}).catch(err=>{
    // console.log('Some error has occured');
    console.log(err);
});

const Movie = mongoose.model('Movie', model.schema);

// READ MOVIES.JSON FILE 
const movies = JSON.parse(fs.readFileSync('./data/movies1.json', 'utf-8')); // from root directory (which is current directory)

// DELETE EXISTING MOVIE DOCUMENTS FROM COLLECTION
const deleteMovies = async ()=>{
    try{
        await Movie.deleteMany();
        console.log('Data successfully deleted!');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
}

// IMPORT MOVIES DATA TO MONGODB COLLECTION 
const importMovies = async ()=>{
    try{
        await Movie.create(movies);
        console.log('Data successfully imported!');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
}

// deleteMovies();
// importMovies();

console.log(process.argv);

if(process.argv[2] === '--import'){
    importMovies();
}
if(process.argv[2] === '--delete'){
    deleteMovies();
}
