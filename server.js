const dotenv = require('dotenv');
dotenv.config({path:'./config.env'}); 
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    process.exit(1);
});

const app = require('./app');       // use this after config
// ["🚗", "🚙", "🚕"]❤️ ♡ 
// CREATE A SERVER 
// USING PORT from ENVIRONMENT VARIABLE 
// const port = process.env.PORT || 1000;
const port = process.env.PORT;
// console.log(process.env.CONN_STR);

// Connecting to DB
mongoose.connect("mongodb://127.0.0.1:2000/netflix")
    .then((conn) => {
        console.log("DB Connection Successful");
    });


// let port = dotenv.PORT;
const server = app.listen(port, ()=>{
    console.log(`Server has started.....${port}`);
});

// entry point for our express app 

process.on('unhandledRejection', (err)=>{
    console.log(err.name,err.message);
    console.log('Unhandled rejection occured! Shutting down...');
    server.close(()=>{
        process.exit(1);
    });
});

