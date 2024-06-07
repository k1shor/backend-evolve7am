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
exports.getOrderDetails = async (req, res) => {
    let order = await Order.findById(req.params.id).populate('user','username')
    .populate({path:'orderItems',populate:{path:"product",populate:'category'}})
    if(!order){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(order)
}


// order by user
exports.getOrderByUser = async (req, res) => {
    let orders = await Order.find({user: req.params.userID}).populate('user','username')
    .populate({path:'orderItems',populate:{path:"product",populate:'category'}})
    if(!orders){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(orders)
}

// update order
exports.updateOrder = async (req, res) => {
    let orderToUpdate = await Order.findByIdAndUpdate(req.params.id,{
        order_status: req.body.order_status
    },{new:true})
    if(!orderToUpdate){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(orderToUpdate)
}

// delete order
exports.deleteOrder = (req, res) => {
    Order.findByIdAndDelete(req.params.id)
    .then(order=>{
        if(!order){
            return res.status(400).json({error:"Order not found"})
        }
        order.orderItems.map(ORDERITEM=>{
            OrderItems.findByIdAndDelete(ORDERITEM)
            .then(orderItem=>{
                if(!orderItem){
                    return res.status(400).json({error:"Something went wrong"})
                }
            })
        })
        res.send({message:"ORder deleted successfully"})
    })
    .catch(error=>res.status(400).json({error:error.message}))
}
