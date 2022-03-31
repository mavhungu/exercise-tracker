const express = require('express')
const homecontroller = require('../controllers/homecontroller')
const router = express.Router()

router.route('/').get(homecontroller)

module.exports = router