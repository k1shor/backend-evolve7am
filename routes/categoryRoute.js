const router = require('express').Router()
const { postCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controller/categoryController')

// endpoint
router.post('/addcategory', postCategory)
router.get('/getallcategories', getAllCategories)
router.get('/getcategorydetails/:id', getCategoryDetails)
router.put('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id', deleteCategory)


module.exports = router

// fetch(`http://localhost:5000/addcategory`)