const express = require('express')
const router = express.Router()

const User = require('../models/user')

const userController = require('../controller/user')

router.post('/createUser', userController.createUser)

router.post('/loginUser',userController.login)

module.exports = router;