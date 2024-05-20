const router = require('express').Router()
const { userRegister } = require('../controller/userController')


router.post('/register', userRegister)


module.exports = router