const express = require('express')
const router = express.Router()

const User = require('../models/users')

const userController = require('../controller/user')

router.post('/createUser', userController.createUser)

router.post('/login',userController.login)

module.exports = router;