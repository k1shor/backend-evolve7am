const router = require('express').Router()
const { postCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controller/categoryController')
const { requireLogin, requireAdmin } = require('../controller/userController')
const { category_rules, validation_method } = require('../validation')

// endpoint
// router.post('/addcategory', requireAdmin, category_rules, validation_method, postCategory)
router.post('/addcategory', category_rules, validation_method, postCategory)
router.get('/getallcategories', getAllCategories)
router.get('/getcategorydetails/:id', getCategoryDetails)
router.put('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id',  deleteCategory)


module.exports = router

// fetch(`http://localhost:5000/addcategory`)