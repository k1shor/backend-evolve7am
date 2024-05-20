const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
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

    let user = await User.create({ username, email, password:hashed_password })
    if(!user){
        return res.status(400).json({error:"Something went wrong"})
    }
// generate token
    let token = await Token.create({
        token: crypto.randomBytes(16).toString('hex'),
        user: user._id
    })
    if(!token){
        return res.status(400).json({error:"Something went wrong"})
    }
    


// send token in email




    res.send(user)
}