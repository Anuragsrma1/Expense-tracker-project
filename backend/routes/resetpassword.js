const express = require('express');

const resetpasswordController = require('../controller/resetpassword');


const router = express.Router();

router.post('/forgotpassword', resetpasswordController.forgotpassword);
router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword);
router.get('/resetpassword/:id', resetpasswordController.resetpassword);

module.exports = router;