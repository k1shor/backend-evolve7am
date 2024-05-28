// [orderItem._ids], user, shipping-info, status, total

const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: ObjectId,
        ref: "OrderItems"
    }],
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    street:{
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    order_status:{
        type: String,
        default: "Pending"
    }


},{timestamps: true})
module.exports = mongoose.model("Order",orderSchema)