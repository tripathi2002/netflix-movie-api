const CustomError = require("../utils/custom.error");

const devErrors = (res, error)=>{
    // console.log("dev")
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

const castErrorHandler = (err)=> {
    const msg = `Invalid value for ${err.path}: ${err.value._id}!`
    return new CustomError(msg, 400);
}

const duplicateKeyErrorHandler = (err)=>{
    const name = err.keyValue.name;
    const msg = `There is already a movie with name "${name}". Please use another name!`;
    return new CustomError(msg, 400);
}

const prodErrors = (res, error)=>{
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try agin later.'
        });
    }
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500; // 500 = internal server error 
    error.status = error.status || 'error';
    // console.log(error);
    // console.log("environment:: ", process.env.NODE_ENV);
    if(process.env.NODE_ENV === 'development'){
        devErrors(res, error);
    } else if(process.env.NODE_ENV === 'production') {
        // let err = {...error}; // destructuring the object
        // console.log("error: ",error);
        if(error.name === 'CastError'){
            error = castErrorHandler(error);
        }
        if(error.code === 11000 ) error = duplicateKeyErrorHandler(error);

        prodErrors(res, error);
    }
}