const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    // _id : default created by mongodb
    category_name: {
        type: String,
        trim: true,
        required: true,
    }
},{timestamps: true})
// timestamps: true -> createdAt, updatedAt

module.exports = mongoose.model("Category", categorySchema)