const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const sendEmail = require('../utils/emailSender')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')


// register
exports.userRegister = async (req, res) => {
    let { username, email, password } = req.body

    let userExists = await User.findOne({ username })
    if (userExists) {
        return res.status(400).json({ error: "Username already taken" })
    }

    userExists = await User.findOne({ email })
    if (userExists) {
        return res.status(400).json({ error: "Email already registered" })
    }

    let salt = await bcrypt.genSalt(saltRounds)
    let hashed_password = await bcrypt.hash(password, salt)

    let user = await User.create({ username, email, password: hashed_password })
    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // generate token
    let token = await Token.create({
        token: crypto.randomBytes(16).toString('hex'),
        user: user._id
    })
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    let URL = `http://localhost:5000/verifyuser/${token.token}`

    // send token in email
    sendEmail({
        from: 'noreply@something.com',
        to: email,
        subject: "Verification Email",
        text: `Click on the following link, or copy paste it in browser to verify your account ${URL}`,
        html: `<a href='${URL}'><button>Verify Email</button></a>`
    })

    res.send(user)
}

// verify email 
exports.verifyEmail = async (req, res) => {
    // check token if valid or not
    let token = await Token.findOne({token: req.params.token})
    if(!token){
        return res.status(400).json({error:"Invalid or token may have expired"})
    }
    // find user
    let user = await User.findById(token.user)
    if(!user){
        return res.status(400).json({error:"User not found"})
    }
    // check if already verified
    if(user.isVerified){
        return res.status(400).json({error:"User already verified, login to continue"})
    }

    // verify user
    user.isVerified = true
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"Failed to verify. Try again later"})
    }

    res.send({message: "User verified successfully"})
}

// forget password
exports.forgetPassword = async (req, res) => {
    // check if email is registered or not
    let user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json({error:"Email not registered"})
    }
    // generate token
    let token = await Token.create({
        token: crypto.randomBytes(16).toString('hex'),
        user: user._id
    })
    if(!token){
        return res.status(400).json({error:"Something went wrong"})
    }
    // send in email
    let URL = `http://localhost:5000/resetpassword/${token.token}`
    sendEmail({
        from: "noreply@something.com",
        to: req.body.email,
        subject:"Reset Password",
        text: `Click on the link or copy paste link in browser to reset password. ${URL}`,
        html: `<a href='${URL}'><button>Reset Password</button></a>`
    })
    res.send({message:"Password reset link has been sent to your email."})
}

// reset password
exports.resetpassword = async (req,res) => {
    let token = await Token.findOne({token: req.params.token})
    if(!token){
        return res.status(400).json({error:"Invalid token or token may have expired"})
    }
    let user = await User.findById(token.user)
    if(!user){
        return res.status(400).json({error:"User not found"})
    }

    let salt = await bcrypt.genSalt(saltRounds)
    user.password  = await bcrypt.hash(req.body.password, salt)
     
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send({message:"Password reset successfully"})
}

// user update 
exports.updateUser = async (req, res) => {
    let userToUpdate = await User.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        role: req.body.role,
        isVerified: req.body.isVerified
    },{new:true})
    if(!userToUpdate){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(userToUpdate)
}

// login
exports.login = async (req, res) => {
    let {email, password} = req.body
    // check email if registered or not
    let user = await User.findOne({email})
    if(!user){
        return res.status(400).json({error:"User not registered."})
    }
    // check password if match or not
    let validLogin = await bcrypt.compare(password, user.password)
    if(!validLogin){
        return res.status(400).json({error:"Email and password do not match"})
    }
    // check if user is verified or not
    if(!user.isVerified){
        return res.status(400).json({error:"User not verified. Please verify"})
    }

    let {_id, username, role} = user
    // generate login token using jwt
    let token = await jwt.sign({_id, username, role, email}, process.env.JWT_SECRET)
    // send token to frontend
    res.cookie('MyCookie', token, {maxAge: 86400} )
    res.send({token, user: {_id, email, username, role}})
}

exports.requireLogin = async (req, res, next) => {
    expressjwt({
        algorithms: ['HS256'],
        secret: process.env.JWT_SECRET
    })(req, res, (error)=>{
        if(error){
            return res.status(401).json({error:"You must login to access this resource"})
        }
        else{
            next()
        }
    })
}
// check admin
exports.requireAdmin = async (req, res, next) => {
    expressjwt({
        algorithms: ['HS256'],
        secret: process.env.JWT_SECRET
    })(req, res, (error)=>{
        if(error){
            return res.status(401).json({error:"You must login to access this resource"})
        }
        else if(req.auth.role != 1 ){
            return res.status(401).json({error:"You must be admin"})
        }
        else{
            next()
        }
    })
}