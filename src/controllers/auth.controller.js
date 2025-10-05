const User = require("./../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/custom.error");
const util = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

const createSendResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const options = {
    maxAge: process.env.LOGIN_EXPIRES,
    httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") options.secure = true;

  res.cookie("jwt", token, options);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendResponse(newUser, 201, res);
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  // const email = req.body.email;
  // const password = req.body.password;

  const { email, password } = req.body; // object destructuring syntax

  // Check if email & password is present in request body
  if (!email || !password) {
    const error = new CustomError(
      "Please provide email ID & Password for login!",
      404
    );
    return next(error);
  }

  // Check if user exists with given email
  const user = await User.findOne({ email }).select("+password");

  // const isMatch = await user.comparePasswordInDb(password, user.password);

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new CustomError("Incorrect email or password", 400);
    return next(error);
  }

  createSendResponse(user, 200, res);
});

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  // GET CURRENT USER DATA FROM DATABASE
  const user = await User.findById(req.user._id).select("+password");

  // CHECK IF THE SUPPLIED CURRENT PASSWORD IS CORRECT
  if (
    !(await user.comparePasswordInDb(req.body.currentPassword, user.password))
  ) {
    return next(
      new CustomError("The current password you provided is wrong", 401)
    );
  }

  // IF SUPPLIED PASSWORD IS CORRECT, UPDATE USER PASSWORD WITH NEW VALUE
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  createSendResponse(user, 200, res);
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  // 1. Read the token & check if it exist
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  if (!token) {
    const error = new CustomError("You are not logged in!", 401);
    return next(error);
  }

  // 2. validate the token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );
  // console.log(decodedToken);
  // 3. If the user exists
  const user = await User.findById(decodedToken.id);

  if (!user) {
    const error = new CustomError(
      "The user with the given token does not exist",
      401
    );
    return next(error);
  }

  // 4. If the user changed password after the token was issued
  const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
  if (isPasswordChanged) {
    const error = new CustomError(
      "The password has been changed recently. Please login agin",
      401
    );
    return next(error);
  }

  // 5. Allow user to access route
  req.user = user;
  next();
});

exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(
        "You do not have permission to perform this action",
        403
      );
      next(error);
    }
    next();
  };
};

// exports.restrict = (...role) => { // (...) is a rest perameter
//     return (req, res, next) => {
//         if (!role.includes(req.user.role)) {
//             const error = new CustomError('You do not have permission to perform this action', 403);
//             next(error);
//         }
//         next();
//     }
// }
