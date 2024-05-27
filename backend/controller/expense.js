const {where} = require('sequelize');
const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();


const uploadToS3 = async(data,filename) =>{
     const BUCKET_NAME= process.env.BUCKET_NAME;
     const IAM_USER_KEY =process.env.IAM_USER_KEY;
     const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

     const s3bucket = new AWS.S3({
        accessKeyId : IAM_USER_KEY,
        secretAccessKey : IAM_USER_SECRET,
        Bucket : BUCKET_NAME
     });

//      s3bucket.createBucket(() => {
//          var params = {
//             Bucket : BUCKET_NAME,
//             key:filename,
//             body : data,
//             ACL : 'public-read'
//          }

//          return new promise((resolve,reject) => {
//             s3bucket.upload(params ,(err,s3response) => {
             
//                 if(err){
//                   console.log('Something went wrong',err)
//                   reject(err);
//                 }else{
//                   console.log('success',s3response);
//                    s3response.Location;
//                 }
//                })  
//          })

//      })
// }

const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
};

try {
    const uploadResult = await s3bucket.upload(params).promise();
    console.log('File uploaded successfully:', uploadResult.Location);
    return uploadResult.Location;
} catch (error) {
    console.error('Error uploading file:', error);
    throw error; 
}
};


// const downloadExpenses = async(req,res) => {
//     const expenses = await req.user.getexpenses;
//     // console.log(expenses);
//     const stringifyExpenses = JSON.stringify(expenses);

//     // it should be depend on the userid
//     const userid = req.user.id;
   
//     const filename = `Expense${userid}/${new Date()}.txt`;
//     // const fileURL = uploadToS3(stringifyExpenses,filename);
//    return res.status(200).json({ fileURL ,success: true});

// }

// Downloading repots 
const downloadReports = async (req, res, next) => {
    try{
    const expenses = await req.user.getExpenses();
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id; 
    const filename = `expenses${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses, filename);
    res.status(200).json({fileURL, success: true});
    
    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
}



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

const deleteexpense = async (req, res, next) => {
    const t = await sequelize.transaction()
    try {
        const ProdId = req.params.id;

        const expansesData = await Expense.findByPk(ProdId);
        // console.log(expansesData.amount);

        totalExpesesAmount = Number(req.getuserdata.totalexpenses) - Number(expansesData.amount);
        await Expense.destroy({ where: { id: ProdId, userId: req.getuserdata.id } })

        await t.commit()
        res.status(200).json({ data: 'data hase deleted succesfull' });
    } catch (err) {
        await t.rollback()
        res.status(500).json({
            Error: err
        })
    }
}

async function countExpenses() {
    try {
        let totalExpenses = 0;
       let expenses = await Expense.findAll()
        // console.log('line 125',expenses);
        expenses.forEach(element => {
            totalExpenses++;
            element.id;
        })
        // console.log('line 131',totalExpenses);
        return totalExpenses
    } catch (error) {

        return error
    }

}

const paginateData = async (req, res, next) => {
    try {
        console.log('line 142',req.query.page);
        // console.log('this is my console');
        page = +req.query.page || 1;
        const pageSize = +req.query.pageSize || 3;
        totalexpenses = Number(await countExpenses())
        // console.log("total Expenses>>> ", +totalexpenses)
        let getData = await Expense.findAll({
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: [['id', 'DESC']]
        });
        // console.log('line 153',getData);
      return  res.status(200).json({
            allExpense: getData,
            currentPage: page,
            hasNextPage: pageSize * page < totalexpenses,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalexpenses / pageSize)
        })


    } catch (error) {
        console.log(error);
      return  res.status(400).json({ success: false, Error: error.message })
    }

}


module.exports = {
     deleteexpense,
    getexpenses,
    addexpense,
    downloadReports,
    paginateData
}