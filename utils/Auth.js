const bcrypt = require( "bcryptjs" )
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const {SECRET}= require('../config')
const passport = require('passport')
const userRegister = async( userDets, role, res)=>{
    try {
        let usernameNotTaken = await validateUsername(userDets.username)
            if(!usernameNotTaken){
                return res.status(400).json({
                    message:`user name is taken`,
                    success:false
                })
    }
        let emailNotRegistered = await validateEmail(userDets.email)
            if(!emailNotRegistered){
                return res.status(400).json({
                    message:`Email is readly registered`,
                    success:false
                })
            }
    // hashed password
        const password = await bcrypt.hash(userDets.password,12)
            const newUser = new User({
                ...userDets,
                password,
                role
            })
            await newUser.save()
            return res.status(201).json({
            message:" successfully register",
            success:true
        })
        
    } catch (err) {
        return res.status(500).json({
            message:" not successfully register",
            success:false
        })
    }
}
const userLogin = async(userCreds,role, res)=>{
    let {username, password} = userCreds;
    //check username 
    const user = await User.findOne({username})
    if(!user){
        return res.status(404).json({
            message:" Username is not Found",
            success: false
        })
    }
    // check role
    if(user.role!== role){
        return res.status(403).json({
            message:" please make sure you are logging in from the right portal",
            success: false
        })
    }

    // check password
    let isMatch = await bcrypt.compare(password, user.password)
    if(isMatch){
        let token = jwt.sign(
            {user_id:user._id, role:user.role, username: user.username, email:user.email},
            SECRET,
            {expiresIn:"7 day"}
        )
        let result ={
            username:user.username,
            role:user.role,
            email: user.email,
            token: `bearer ${token}`,
            expiresIn:168
        }
        return res.status(200).json({
            ...result,
            message:" login sucess",
            success: true
        })
    } else {
        return res.status(403).json({
            message:" incorrect password",
            success: false
        })
    }
}
const validateUsername = async username => {
    let user = await User.findOne({username})
    return user ? false :true;
}
const validateEmail = async email => {
    let user = await User.findOne({email})
    return user ? false :true;
}
// passport middlewares
const checkRole = roles => (req, res, next) =>{
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();
}
const userAuth = passport.authenticate("jwt", { session: false });
const serializeUser = user => {
    return {
      username: user.username,
      email: user.email,
      name: user.name,
      _id: user._id,
    //   updatedAt: user.updatedAt,
    //   createdAt: user.createdAt
    };
  };
module.exports={
    serializeUser,
    userRegister,
    userLogin,
    userAuth,
    checkRole,
}