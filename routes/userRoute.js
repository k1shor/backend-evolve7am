const router = require('express').Router()
const { userRegister, verifyEmail, forgetPassword, resetpassword, updateUser, login } = require('../controller/userController')


router.post('/register', userRegister)
router.get('/verifyuser/:token', verifyEmail)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token', resetpassword)
router.put('/updateuser/:id', updateUser)
router.post("/login", login)
module.exports = router