const express = require('express')
require('dotenv').config()
require('./database/connection')

const app = express()
const port = process.env.PORT

// middleware
app.use(express.json())


// Routes Import
// const TestRoute = require('./routes/testRoute')
const CategoryRoute = require('./routes/categoryRoute')
const ProductRoute = require('./routes/productRoute')
const UserRoute = require('./routes/userRoute')
const OrderRoute = require('./routes/orderRoute')




// USING Routes
// app.use(TestRoute)
app.use(CategoryRoute)
app.use(ProductRoute)
app.use(UserRoute)
app.use(OrderRoute)



app.listen(port, () => {
    console.log(`App started successfully at port ${port}`)
})