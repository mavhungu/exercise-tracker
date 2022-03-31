const express = require('express')
const {homecontroller, healthcheckcontroller} = require('../controllers/homecontroller')
const router = express.Router()

router.route('/').get(homecontroller)
router.route('/healthcheck')
.get(healthcheckcontroller)

module.exports = router;