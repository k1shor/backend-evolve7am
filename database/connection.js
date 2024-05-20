const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE)
    .then(() => console.log("DATABASE connected successfully"))
    .catch(error => console.log(error.message))