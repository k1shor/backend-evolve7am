const { check, validationResult } = require('express-validator')

exports.category_rules = [
    check("category_name", "Category name is required").notEmpty()
        .isLength({ min: 3 }).withMessage("Category must be at least 3 characters")
]

exports.validation_method = (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next()
}

exports.product_rules = [
    check("title", "Product Name is required").notEmpty()
        .isLength({ min: 3 }).withMessage("Product Name must be at least 3 characters"),
    check("price", "Price is required").notEmpty()
        .isNumeric().withMessage("Price must be a number"),
    check("description", "Description is required").notEmpty()
        .isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),
    check("count_in_stock", "Count in stock is required").notEmpty()
        .isNumeric().withMessage("Countmust be a number")
]

exports.user_rules = [
    check("username","User name is required").notEmpty()
    .isLength({min:3}).withMessage("Username must be at least 3 characters"),
    check("email","Email is required").notEmpty()
    .isEmail().withMessage("Invalid E-mail"),
    check("password","Password is required").notEmpty()
    .matches(/[a-z]/).withMessage("Password must contain at least 1 lowercase character")
    .matches(/[A-Z]/).withMessage("Password must contain at least 1 uppercase character")
    .matches(/[0-9]/).withMessage("Password must contain at least 1 uppercase character")
    .matches(/[+!#@-]/).withMessage("Password must contain special characters")
    .isLength({min:8}).withMessage("Password must be at least 8 characters")
]