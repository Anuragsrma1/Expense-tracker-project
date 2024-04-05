const User = require('../models/user')
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true
    }else{
        return false
    }
}
 
exports.createUser = async(req,res) => {
    try{
        // console.log('start');
        const { username, email,password} = req.body;
        //    console.log('line15');
         console.log('email',email,username,password);
         if(isstringinvalid(username) || isstringinvalid(email) || isstringinvalid(password))
           {   
        return res.status(400).json({err : "Bad parameters , something is missing"})    
     }
//   console.log('line 22');
//   const user =   await User.create(
//  {  name:username,email:email,password:password
//         })cd ac
//   console.log('line 23');
        // console.log(user);
        // console.log('line26');
    //     res.status(201).json({message : 'Successfully create new user'})    

    //      }catch(e){
    //         console.log(e);
    //      return res.status(500).json({msg : "Internal server error"})
    // }
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

exports.login = async(req,res) => {
    try{
        console.log('start');
          const { email , password } = req.body;
        console.log('line 41');
     if(isstringinvalid(email) || isstringinvalid(password))
       {
        return res.status(400).json({msg : 'email id or password is missing' , success : false})
       }
       console.log('line 46');
     console.log(password);
     const user = await User.findAll({where : {email}})
     console.log('line 47');
     if(user.length > 0){
        bcrypt.compare(password, user[0].password,(err,result) =>{
            if(err){
                throw new Error('something went wrong')
            }

            if(result === true){
                res.status(200).json({success : true , message : "User logged in successfully"});
            }else {
                return res.status(400).json({success: false, message : 'password is incorrect'});
    
            }
        })
        
     }
     else{
        return res.status(400).json({success : false , message: 'user doesnot found'});
     }
    }catch(e){
      
        return res.status(500).json({msg : err , success: false})
    }
}                                                                                                  