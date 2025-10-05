const dotenv = require('dotenv');
dotenv.config({path:'./src/.env'}); 
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    process.exit(1);
});

const app = require('./src/app');       // use this after config
// ["🚗", "🚙", "🚕"]❤️ ♡ 
// CREATE A SERVER 
// USING PORT from ENVIRONMENT VARIABLE 
const port = process.env.PORT || 1000;
const conn_str = process.env.CONN_STR || process.env.DB_URI || "mongodb://127.0.0.1:2000/netflix";

// console.log(process.env.CONN_STR);
// Connecting to DB
mongoose.connect(conn_str)
    .then((conn) => {
        console.log(`DB Connection Successful: ${conn_str}`);
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

