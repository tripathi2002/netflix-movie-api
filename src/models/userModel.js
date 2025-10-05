const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

// name, email, password, confirmPassword, photo
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.'],
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        // enum: ['user', 'admin', 'test1', 'test2'],
        default: 'user' 
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            // This validator will only work for save() & create()
            validator: function(val){
                return val == this.password;
            },
            message: 'Password & Confirm Password does not match!'
        }
    },
    passwordChangedAt: Date, 

});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    // encrypt the password before saving it 
    this.password = await bcrypt.hash(this.password, 2);

    this.confirmPassword = undefined;
    next();
});

userSchema.methods.comparePasswordInDb = async function(pswd, pswdDB){
    return await bcrypt.compare(pswd, pswdDB);
}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const pswdChangedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        // console.log(this.passwordChangedAt, JWTTimestamp, pswdChangedTimestamp);

        return JWTTimestamp < pswdChangedTimestamp; // 1704724485 < 1717286400
    }
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
