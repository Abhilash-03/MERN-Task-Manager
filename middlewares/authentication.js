const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticated = async(req, res, next) => {
  const token = req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');

    if(!token) {
      throw new UnauthenticatedError("Authentication Invalid!");
    }

   try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {userId: payload.userId, name: payload.name};
    next();
    
   } catch (error) {
     throw new UnauthenticatedError('Authentication is Invalid!');
   }
    
   

}

module.exports = authenticated