const { BadRequest, UnauthenticatedError } = require('../errors');
const User = require('../models/Users');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');

const register = async(req, res) => {
    const {username, password, email} = req.body;

    if(!username || !password || !email){
        throw new BadRequest('Username, Email, and Password must be provided!');
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const register_user = await User.create({username, email, password: hashedPwd});

    const token = register_user.jwtCreate();

    res.status(StatusCodes.CREATED).json({ user: { username: register_user.username }, token });

}

const login = async(req, res) => {
   const {email, password} = req.body;

   if(!email || !password){
    throw new BadRequest('Email and Password both are required');
   }

   const user = await User.findOne({email});

   if(!user){
    throw new UnauthenticatedError('Invalid Credentials!');
   }

//    compare password
    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentails!');
    }

    // create token
    const token = user.jwtCreate();

    user.accessToken = token;
    await user.save();

    res.status(200).json({user: {username: user.username}, token});

}


module.exports = {
    register,
    login
}