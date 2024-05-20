const router = require('express').Router()
const { addProduct, productlist, productlistByCategory, productDetails, updateProduct, deleteProduct } = require('../controller/productController')
const upload = require('../utils/fileUpload')


router.post(`/addproduct`, upload.single('image'), addProduct)
router.get('/getallproducts', productlist)
router.get('/getallproducts/:category_id', productlistByCategory)
router.get('/productdetails/:id', productDetails)
router.put('/updateproduct/:id', upload.single('image'), updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)

module.exports = router