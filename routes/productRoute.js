const router = require('express').Router()
const { addProduct, productlist, productlistByCategory, productDetails, updateProduct, deleteProduct, getFilteredProducts } = require('../controller/productController')
const { requireAdmin } = require('../controller/userController')
const upload = require('../utils/fileUpload')
const { product_rules, validation_method } = require('../validation')


router.post(`/addproduct`, upload.single('image'), product_rules, validation_method, addProduct)
router.get('/getallproducts', productlist)
router.get('/getallproducts/:category_id', productlistByCategory)
router.get('/productdetails/:id', productDetails)
router.put('/updateproduct/:id', upload.single('image'), updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)
router.post('/getfilteredproducts', getFilteredProducts)

module.exports = router