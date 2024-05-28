const OrderItems = require('../models/OrderItemsModel')
const Order = require("../models/OrderModel")

/*
orderitems: [{product, quantity}, {product, quantity}]
user: userID
total: x (calculate)
street, city, zipcode, state, country, phone
*/
// place order
exports.placeOrder = async (req, res) => {
    let orderItemsIds = await Promise.all(
        req.body.orderitems.map(async orderItem => {
            let ORDERITEM = await OrderItems.create({
                product: orderItem.product,
                quantity: orderItem.quantity
            })
            if (!ORDERITEM) {
                return res.status(400).json({ error: "Something went wrong" })
            }
            return ORDERITEM._id
        })
    )
    // calculate total
    let individualTotals = await Promise.all(
        orderItemsIds.map(async orderitemid => {
            let ORDERITEM = await OrderItems.findById(orderitemid).populate('product', 'price')
            return ORDERITEM.product.price * ORDERITEM.quantity
        })
    )
    let total = individualTotals.reduce((acc,cur)=>acc+cur)

    let orderToAdd = await Order.create({
        orderItems: orderItemsIds,
        user: req.body.user,
        total: total,
        street: req.body.street,
        city: req.body.city,
        zipcode: req.body.zipcode,
        state: req.body.state,
        country: req.body.country,
        phone: req.body.phone
    })
    if(!orderToAdd){
        return res.status(400).json({error:"Failed to place order"})
    }
    res.send(orderToAdd)
}

// order list
exports.getAllOrders = async (req, res) => {
    let orders = await Order.find().populate('user','username')
    .populate({path:'orderItems',populate:{path:"product",populate:'category'}})
    if(!orders){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(orders)
}


// order details

// order by user

// update order

// delete order