// IMPORT PACKAGE 
const express = require('express');
const morgan = require('morgan');         
const moviesRouter = require('./routes/moviesRoutes');

let app = express();
app.use(express.json());

// if(process.env.NODE_ENV === 'devlopment'){
// }
app.use(morgan('dev'));                 //calling morgan function

app.use(express.static('./public'));       //creating route for static folder for acces files on there
app.use((req, res, next) => {
    // req.requestedAt = new Date().toISOString();
    req.requestedAt = new Date().toDateString();
    next();
});

// USING ROUTES
app.use('/api/v2/movies', moviesRouter);    // calling moviesRouter middleware

// EXPORTING APP OBJECT 
module.exports = app;