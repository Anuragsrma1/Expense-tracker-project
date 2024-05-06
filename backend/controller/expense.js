const { where } = require('sequelize');
const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../util/database');

const addexpense = async (req, res) => {

    const t = await sequelize.transaction();
    try{
    const { expenseamount, description, category } = req.body;

    if(expenseamount == undefined || expenseamount.length === 0 ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
    
   const expense = await Expense.create({ expenseamount, description, category, userId: req.user.id},{transaction : t})
    const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount)  
    await User.update ({
        totalExpenses : totalExpense
   },{
    where : {id : req.user.id},
    transaction : t
   })
   await t.commit();
    res.status(200).json({expense : expense})
   }
    catch(err){
       await t.rollback();
        return res.status(500).json({success : false, error: err})
    }
}

const getexpenses = (req, res)=> {
    
    Expense.findAll({ where : { userId: req.user.id}}).then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err, success: false})
    })
}

const deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    if(expenseid == undefined || expenseid.length === 0){
        return res.status(400).json({success: false, })
    }
    Expense.destroy({where: { id: expenseid, userId: req.user.id }}).then(async expenseid =>{
        req.user.totalExpenses = Number(req.user.totalExpenses) - Number(expenseid[0].expenseamount)
        console.log(expenseid)
        await req.user.save()
        return expenseid[0].destroy()
    }).then(()=>{
        return res.status(200).json({success : true , msg : "deleted successfully"})
    }).catch(e =>{
        console.log(e)
        return res.status(401).json({success : false })
    })
}

module.exports = {
    deleteexpense,
    getexpenses,
    addexpense
}