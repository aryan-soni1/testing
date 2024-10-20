const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const authentication = expressAsyncHandler(async (req, res, next) => {
  let token;
  if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }else{
    res.status(400)
    throw new Error("token is not present or user is not logged in")
  }

  const decode = jwt.verify(token,process.env.JWT_SECRET)
  console.log(decode)
  if(!decode){
    console.log("invalid token")
  }

  req.user =decode;

  console.log(token);
  next();
});

const isStudent = expressAsyncHandler(async(req,res,next)=>{
  const {role} = req.user;
  if(role !== "Student"){
    res.status(400)
    throw new Error("this is a protected route for student only")
  }
  next()
})

const isInstructor = expressAsyncHandler(async(req,res,next)=>{
  const {role} = req.user;
  if(role !== "Teacher"){
    res.status(400)
    throw new Error("this is a protected route for student only")
  }
  next()
})

module.exports = { authentication };
