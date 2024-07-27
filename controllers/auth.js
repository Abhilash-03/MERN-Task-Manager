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
    const register_user = await User.create({ username, email, password: hashedPwd });
    res.status(StatusCodes.CREATED).json({ username: register_user.username });
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
        throw new UnauthenticatedError('Password is not correct');
    }

    // create token
    const token = await user.jwtCreate();

    user.accessToken = token;
    await user.save();

    const userInfo = await User.findOne({email}).select("-password -accessToken");

    res.status(200).cookie('auth_token', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 2 * 24 * 60 * 60 * 1000 }).json(userInfo); // in production
    // res.status(200).cookie('auth_token', token, { httpOnly: true, secure: true, maxAge: 2 * 24 * 60 * 60 * 1000 }).json(userInfo); // in development

}

const googleAuth = async(req, res) => {
    const { name, email, googlePhotoUrl } = req.body;
    const user = await User.findOne({email});
    if(!user){
     const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
     const hashedPwd = await bcrypt.hash(generatePassword, 10);
     const newUser = await User.create({
        username: name.toLowerCase().split(" ").join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPwd,
        profilePicture: googlePhotoUrl
     
    })
    const token = await user.jwtCreate();

    user.accessToken = token;
    await user.save();

    const userInfo = await User.findOne({email}).select("-password -accessToken");

    res.status(200).cookie('auth_token', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 2 * 24 * 60 * 60 * 1000 }).json(userInfo);
    //  res.status(200).cookie('auth_token', token, { httpOnly: true, secure: true, maxAge: 2 * 24 * 60 * 60 * 1000 }).json(userInfo); // in development

    } else {
         // create token
        const token = await user.jwtCreate();

        user.accessToken = token;
        await user.save();

        const userInfo = await User.findOne({email}).select("-password -accessToken");

        res.status(200).cookie('auth_token', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 2 * 24 * 60 * 60 * 1000 }).json(userInfo);
        //  res.status(200).cookie('auth_token', token, { httpOnly: true, secure: true, maxAge: 2 * 24 * 60 * 60 * 1000 }).json(userInfo); // in development
    }

}

const logout = async(req, res) => {
  res.status(200).clearCookie('auth_token').json({msg: "You are successfully logout"});
}


module.exports = {
    register,
    login,
    googleAuth,
    logout
}