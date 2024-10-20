const asyncHandler = require("express-async-handler");
const emailValidator = require('email-validator');
const User = require("../model/User.model");
const Otp = require("../model/Otp.model");
const mailSender = require("../utils/mailSender")
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const isValid = emailValidator.validate(email);
    if(!isValid){
      res.status(400)
      throw new Error("email is wrong")
    }

    if (!email) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400);
      throw new Error("User is already registered");
    }
 
    const otp = otpGenerator.generate(6, {  lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    await Otp.create({
        email,
        otp,
    });

    const mailResponse = await mailSender(email, "OTP for password reset", `Your OTP is ${otp}`);

    return res.status(200).json({
        status: "success",
        message: "OTP sent successfully",
    });
 
  });
  

const signup = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    accountType,
    otp
  } = req.body;
  console.log(req.body);

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phoneNumber ||
    !accountType ||
    !otp
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exist");
  }
  const accountTypes = ["Student", "Teacher", "Admin"];
  if (!accountTypes.includes(accountType)) {
    res.status(400);
    throw new Error("Invalid account type");
  }


  const otpExists = await Otp.find({email}).sort({_id : -1}).limit(1);
  if (!otpExists) {
    res.status(400);
    throw new Error("otp not found!");
  }
  
  console.log(otpExists)
  console.log(otpExists.otp)

  if(otp !== otpExists[0].otp || otpExists.createdAt + 5*60*1000 < Date.now() ){
    res.status(400);
    throw new Error("Invalid OTP");
  }

  const hashedPassword = await bcrypt.hash(password,10)
  

  const user = await User.create({
    firstName,
    lastName,
    email,
    password:hashedPassword,
    phoneNumber,
    accountType,
  });

  return res.status(201).json({
    status: "success",
    message: "User created successfully",
    user,
  });
});


 const login = asyncHandler(async(req,res)=>{
     const {email,password} = req.body;
     
     if(!email || !password){
      res.status(400)
      throw new Error("All fields are required")
     }

     const existingUser = await User.findOne({email:email})
     
     if(!existingUser){
      res.status(400)
      throw new Error ("user does not exist kindly signup first")
     }


     const comparePasword = await bcrypt.compare(password,existingUser.password);

     if(!comparePasword){
      res.status(400)
      throw new Error("invalid email or password")
     }

     existingUser.isVerified = true;
     await existingUser.save()
 
     const payload = {
      id:existingUser._id,
      role:existingUser.accountType
     }

     const token = jwt.sign(payload,process.env.JWT_SECRET,{
      expiresIn:3*24*60*60*1000
     })

     return res.status(200).json({
      success:true,
      message:"User loggedIn Successfully!",
      existingUser,
      token
     })


 })

const changePassword = asyncHandler(async(req,res)=>{
        const {oldPassword,newPassword,confirmNewPassword,id} = req.body;
        // const {id} = req.user;
        
        if(!oldPassword || !newPassword || !confirmNewPassword){
          res.status(400)
          throw new Error("all fields are required")
        }

        if(confirmNewPassword !== newPassword){
          res.status(400)
          throw new Error("password does not match")
        }

        const user = await User.findOne({_id:id})

        if(!await bcrypt.compare(oldPassword,user.password)){
          res.status(400)
          throw new Error("old password is invalid!")
        }

        user.password = await bcrypt.hash(newPassword,10)
        await user.save()

        return res.status(200).json({
          success:true,
          message:"password changed successfully",
          user:user
        })

})


                                                                                                                                                                                                             

module.exports = {
  signup,
  sendOtp,
  changePassword,
  login
};
