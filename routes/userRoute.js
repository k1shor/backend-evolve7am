const router = require('express').Router()
const { userRegister, verifyEmail } = require('../controller/userController')


router.post('/register', userRegister)
router.get('/verifyuser/:token', verifyEmail)


module.exports = router