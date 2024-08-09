const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const User = require("../models/Users");
const bcrypt = require('bcryptjs');

const deleteAccount = async(req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.uid).select('-password -accessToken');
    if(!deletedUser){
        throw new BadRequest("User not exists");
    }
    res.status(200).clearCookie('auth_token').json({message: "Account deleted", user: deletedUser});
}

const updateUserProfile = async(req, res) => {
    const {username, email, password, profilePicture} = req.body;
    const user = await User.findById(req.params.uid);
    if(!user){
        throw new BadRequest("You're not allowed to update this user.");
    }
    if(username){
        if(username.length < 8 || username.length > 20){
         throw new BadRequest("Username must be between 8 to 20 characters.");
        }
        if(username !== username.toLowerCase()){
            throw new BadRequest("Username must be in lower case.");
        }
        if(username.includes(' ')){
            throw new BadRequest("Username should not contain any spaces.");
        }
        if(!username.match(/^[a-zA-Z0-9_.-]+$/)){
            throw new BadRequest("Username can only contain letters, numbers, '_', '-', and '.'");
        }
    }

    let changedPassword;
    if(password){
        if(password.length < 6){
            throw new BadRequest("Password must be at least 6 characters");
        }
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\w\s@$!%*?&]{6,11}$/)) {
            throw new BadRequest("Password must be between 6 and 12 characters and include at least 1 uppercase, lowercase, number, and special character");
        }
        changedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUserProfile = await User.findByIdAndUpdate(
        req.params.uid,
        {
            $set: {
                username,
                email,
                password: changedPassword,
                profilePicture
            }
        },
        { new: true }
    ).select("-password -accessToken");

    res.status(200).json(updatedUserProfile);
}

module.exports = {
    deleteAccount,
    updateUserProfile
}