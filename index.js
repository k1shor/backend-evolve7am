const express = require('express')
require('dotenv').config()
require('./database/connection')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const port = process.env.PORT

// middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))


// Routes Import
// const TestRoute = require('./routes/testRoute')
const CategoryRoute = require('./routes/categoryRoute')
const ProductRoute = require('./routes/productRoute')
const UserRoute = require('./routes/userRoute')
const OrderRoute = require('./routes/orderRoute')




// USING Routes
// app.use(TestRoute)
app.use('/api',CategoryRoute)
app.use('/api',ProductRoute)
app.use('/api',UserRoute)
app.use('/api',OrderRoute)


app.use('/public/uploads',express.static('public/uploads'))


app.listen(port, () => {
    console.log(`App started successfully at port ${port}`)
})