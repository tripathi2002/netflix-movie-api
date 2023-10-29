const dotenv = require('dotenv');
dotenv.config({path:'./config.env'}); 

const app = require('./app');       // use this after config

// CREATE A SERVER 
// USING PORT from ENVIRONMENT VARIABLE 
// const port = process.env.PORT || 1000;
const port = process.env.PORT;
// console.log(process.env.CONN_STR);

// let port = dotenv.PORT;
app.listen(port, ()=>{
    console.log(`Server has started.....${port}`);
});

// entry point for our express app