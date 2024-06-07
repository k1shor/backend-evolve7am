const router = require('express').Router()
const { placeOrder, getAllOrders, getOrderDetails, getOrderByUser, updateOrder, deleteOrder } = require('../controller/orderController')


router.post('/placeorder',placeOrder)
router.get('/getallorders', getAllOrders)
router.get('/getorderdetails/:id', getOrderDetails)
router.get('/getorderbyuser/:userID',getOrderByUser)
router.put('/updateorder/:id', updateOrder)
router.delete('/deleteorder/:id', deleteOrder)

module.exports = router