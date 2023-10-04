const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: [true, 'Name is required!'],
        minlength: [3, 'Minimum length should be 3'],
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'
        ],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'Provide a password'],
        minlength: 6
    },

    accessToken: String

})

userSchema.methods.jwtCreate =  function(){
    return jwt.sign(
    {
        userId: this._id,
        name: this.username
    },
     process.env.JWT_SECRET,
      {expiresIn: '2d'});

}

userSchema.methods.comparePassword = async function(password){
    const isMatched =  bcrypt.compare(password, this.password);

    return isMatched;
}

module.exports = mongoose.model('User', userSchema);