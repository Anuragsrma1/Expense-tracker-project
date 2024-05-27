const express = require('express');
const router = express.Router();

const expenseController = require('../controller/expense')
const userauthentication = require('../middleware/auth')

router.post('/addexpense', userauthentication.authenticate,  expenseController.addexpense )

router.get('/getexpenses', userauthentication.authenticate,  expenseController.getexpenses )

router.delete('/deleteexpense/:expenseid', userauthentication.authenticate, expenseController.deleteexpense)

router.get('/downloadReports', userauthentication.authenticate, expenseController.downloadReports)

router.get('/pagination', userauthentication.authenticate, expenseController.paginateData);

module.exports = router;
