const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const sendEmail = require('../utils/emailSender')
const saltRounds = 10



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