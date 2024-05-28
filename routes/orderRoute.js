const router = require('express').Router()
const { placeOrder, getAllOrders } = require('../controller/orderController')


router.post('/placeorder',placeOrder)
router.get('/getallorders', getAllOrders)

module.exports = router