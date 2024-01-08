// IMPORT PACKAGE 
const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./routes/movies.routes');
const authRouter = require('./routes/auth.router');
const CustomError = require('./utils/custom.error');
const globalErrorHandler = require('./controllers/error.controller')

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
app.use('/api/v2/users', authRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.url} on the server` 
    // });
    // const err = new Error(`Can't find ${req.url} on the server`);
    // err.status = 'fail';
    // err.statusCode = 404;

    const err = new CustomError(`Can't find ${req.url} on the server`, 404);
    next(err);  // if next(100) or any other value express will asume it an err and pass it to global error handler
});

app.use(globalErrorHandler);
// EXPORTING APP OBJECT 
module.exports = app;