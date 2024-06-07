const router = require('express').Router()
const { userRegister, verifyEmail, forgetPassword, resetpassword, updateUser, login, getAllUsers, logOut } = require('../controller/userController')
const { validation_method, user_rules } = require('../validation')


router.post('/register', user_rules, validation_method, userRegister)
router.get('/verifyuser/:token', verifyEmail)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token', resetpassword)
router.put('/updateuser/:id', updateUser)
router.post("/login", login)
router.get("/userlist",getAllUsers)
router.get('/logout', logOut)

module.exports = router