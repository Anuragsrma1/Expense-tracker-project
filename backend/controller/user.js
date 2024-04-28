const User = require('../models/users')
const bcrypt = require('bcrypt')
 const jwt = require('jsonwebtoken')

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true
    }else{
        return false
    }
}
 
 const createUser = async(req,res) => {
    try{
        const { username, email,password} = req.body;
         console.log('email',email,username,password);
         if(isstringinvalid(username) || isstringinvalid(email) || isstringinvalid(password))
           {   
        return res.status(400).json({err : "Bad parameters , something is missing"})    
     }

    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
        console.log(err)
        await User.create({ name :username, email, password: hash })
        res.status(201).json({message: 'Successfuly create new user'})
    })
    }catch(err) {
            res.status(500).json(err);
        }
}

const generateAccessToken =  (id,name) => {
    return jwt.sign({userId : id , name : name} , 'secretkey');
}

const login = async(req,res) => {
    try{
       
          const { email , password } = req.body;
     
     if(isstringinvalid(email) || isstringinvalid(password))
       {
        return res.status(400).json({msg : 'email id or password is missing' , success : false})
       }
 
     console.log(password);
     const user = await User.findAll({where : {email}})
   
     if(user.length > 0){
        bcrypt.compare(password, user[0].password,(err,result) =>{
            if(err){
                throw new Error('something went wrong')
            }

            if(result === true){
                res.status(200).json({success : true , message : "User logged in successfully", token : generateAccessToken(user[0].id, user[0].name)});
            }else {
                return res.status(400).json({success: false, message : 'password is incorrect'});  
            }
        })
        
     }
     else{
        return res.status(404).json({success : false , message: 'user doesnot found'});
     }
    }catch(e){
      
        return res.status(500).json({msg : err , success: false})
    }
}                   

module.exports = {
   createUser,
   login,
    generateAccessToken
}