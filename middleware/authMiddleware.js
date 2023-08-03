const jwt = require("jsonwebtoken");
const User =  require("../models/User");

const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Token : ", token);

  // check json web token exists and is verified
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      console.log("Decoded token : ", decodedToken);
      next();
    } catch (error) {
      console.log(error.message);
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
};

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Token : ", token);

  // check json web token exists and is verified
  if (token) 
  {
    try 
    {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      console.log("Decoded token : ", decodedToken);
      
      let user = await User.findById(decodedToken.id);

      console.log("User from decoded token : ",user);

      res.locals.user = user;

      next();
    } 
    catch (error) 
    {
      console.log(error.message);
      res.locals.user = null;

      next();
    }
  } 
  else
  {
    res.locals.user = null;
    next();
  }
};
module.exports = {
  requireAuth,
  checkUser
};
