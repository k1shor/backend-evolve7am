const express = require('express')
const router = express.Router()
const { testFunction, testFunction1 } = require('../controller/testcontroller2')


router.get('/', testFunction)
router.get('/test', testFunction1)

module.exports = router