const { BadRequest } = require("../errors");
const User = require("../models/Users");
const deleteAccount = async(req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.uid).select('-password -accessToken');
    if(!deletedUser){
        throw new BadRequest("User not exists");
    }
    res.status(200).clearCookie('auth_token').json({message: "Account deleted", user: deletedUser});
}

module.exports = {
    deleteAccount
}