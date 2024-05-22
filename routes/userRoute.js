const router = require('express').Router()
const { userRegister, verifyEmail, forgetPassword, resetpassword } = require('../controller/userController')


router.post('/register', userRegister)
router.get('/verifyuser/:token', verifyEmail)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token', resetpassword)

module.exports = router