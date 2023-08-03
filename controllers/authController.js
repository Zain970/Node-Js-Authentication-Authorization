const User = require("../models/User");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 4 * 60 * 60;
const handleErrors = (err)=>{
    
    let errors = {
        email : "",
        password : ""
    }

    if(err.message == "incorrect email")
    {
        errors.email = "that email is not registered"
    }
    if(err.message == "incorrect password")
    {
        errors.password = "that password is incorrect"
    }

    // Duplicate Error code
    if(err.code === 11000)
    {
        errors.email = "that email is already registered";
        return errors;
    }
    
    // Validation errors
    if(err.message.includes("User validation failed"))
    {
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message
        })
    }

    return errors;
}
const signup_get = (req, res) => {
  res.render("signup");
};

const login_get = (req, res) => {
  res.render("login");
};


const signup_post = async (req, res) => {
  try
  {
    const user =  await User.create(req.body);

    const token = createToken(user._id);

    // Placing the token inside the cookie
    res.cookie("jwt",token,{ httpOnly : true, maxAge : maxAge * 1000});

    res.status(201).json({user:user._id})
  }
  catch(error)
  {
    const errors = handleErrors(error);

    res.status(404).json({
        errors
    })
  }
};
const login_post = async (req, res, next) => {

    const { email , password } = req.body;

    try
    {
        // Login function has all the functionality of checking email and password in the database
        const user = await User.login(email,password);

        const token = createToken(user._id)

        // Placing the token inside the cookie
        res.cookie("jwt",token,{ httpOnly : true, maxAge : maxAge * 1000});

        // Sending the response 
        res.status(200).json({user : user._id})
    }
    catch(error)
    {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
};

const logout_get = (req , res , next)=>{
    console.log("Logout get");
    res.cookie("jwt","",{ maxAge : 1 });
    res.redirect("/");
}

const createToken = (id)=>{

    return jwt.sign({id},process.env.SECRET_KEY,{
        expiresIn : maxAge
    })

}
module.exports = {
  login_get,
  login_post,
  signup_get,
  signup_post,
  logout_get
};
