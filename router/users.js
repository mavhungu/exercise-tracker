const express = require('express')
const {userscontroller, logscontroller, 
    exercisescontroller,
    postuserscontroller,

} = require('../controllers/userscontroller')
const router = express.Router()

router.route('/')
.get(userscontroller)
.post(postuserscontroller)

router.route(':_id/exercises')
.post(exercisescontroller)

router.route(':_id/logs')
.get(logscontroller)

module.exports = router