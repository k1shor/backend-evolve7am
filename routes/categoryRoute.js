const router = require('express').Router()
const { postCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controller/categoryController')
const { requireLogin, requireAdmin } = require('../controller/userController')

// endpoint
router.post('/addcategory', requireAdmin, postCategory)
router.get('/getallcategories', getAllCategories)
router.get('/getcategorydetails/:id', getCategoryDetails)
router.put('/updatecategory/:id', requireAdmin, updateCategory)
router.delete('/deletecategory/:id', requireAdmin, deleteCategory)


module.exports = router

// fetch(`http://localhost:5000/addcategory`)