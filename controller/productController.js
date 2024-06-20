const Product = require('../models/productModel')
const fs = require('fs')

// Product add
exports.addProduct = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "File is required" })
    }
    let newProduct = await Product.create({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        count_in_stock: req.body.count_in_stock,
        category: req.body.category,
        image: req.file?.path
    })
    if (!newProduct) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(newProduct)
}

// get all products
exports.productlist = async (req, res) => {
    let products = await Product.find().populate('category', 'category_name')
    // .select('title')
    // .select('price')
    // .select('-rating')
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)
}

// get product by category
exports.productlistByCategory = async (req, res) => {
    let products = await Product.find({ category: req.params.category_id })
        .populate('category', 'category_name')

    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)
}

// get product detail
exports.productDetails = async (req, res) => {
    let product = await Product.findById(req.params.id).populate('category')
    if (!product) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(product)
}

// update product
exports.updateProduct = async (req, res) => {
    if (req.file) {
        fs.unlink(req.body.imageUrl, error => {
            console.log(error)
        })
    }
    let product = await Product.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        count_in_stock: req.body.count_in_stock,
        rating: req.body.rating,
        category: req.body.category,
        image: req.file?.path
    }, { new: true })
    if (!product) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(product)
}

exports.deleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            if (!product) {
                return res.status(400).json({ error: "Product not found" })
            }
            res.send({ message: "Product deleted successfully" })
        })
        .catch(error => {
            return res.status(400).json({ error: error.message })
        })
}

exports.getFilteredProducts = async (req, res) => {
    let filter = {}
    for (var key in req.body) {
        if (req.body[key].length != 0) {
            {
                if (key === 'category') {
                    filter['category'] = req.body['category']
                }
                else {
                    filter['price'] = {
                        '$gte': req.body['price'][0],
                        '$lte': req.body['price'][1]
                    }
                }
            }
        }
    }
    console.log(filter)
    let products = await Product.find(filter)
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)

}

exports.getRelatedProducts = async (req, res) => {
    let product = await Product.findById(req.params.id)
    let products = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
    })
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)
}