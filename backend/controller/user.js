const User = require('../models/user')

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true
    }else{
        return false
    }
}

exports.createUser = async(req,res) => {
    try{
        console.log('start');
        const { username, email,password,confirm_password} = req.body;

         console.log('email',email);
         if(isstringinvalid(username) || isstringinvalid(email) || isstringinvalid(password)
         || isstringinvalid(confirm_password) )
           {   
        return res.status(400).json({err : "Bad parameters , something is missing"})    
     }

  const res =   await User.create({username,email,password,confirm_password})
        console.log(res);
        res.status(201).json({message : 'Successfully create new user'})    

         }catch(e){
         return res.status(500).json({msg : "Internal server error"})
    }
}

exports.login = async(req,res) => {
    try{
          const { email , password } = req.body;
        
     if(isstringinvalid(email) || isstringinvalid(password))
       {
        return res.status(400).json({msg : 'email id or password is missing' , success : false})
       }
     console.log(password);
     const user = await User.findAll({where : {email}})
     if(user.length > 0){
        if(user[0].password === password){
            res.status(200).json({success : true , message : "User logged in successfully"});
        }else {
            return res.status(400).json({success: false, message : 'password is incorrect'});
        }
     }
     else{
        return res.status(400).json({success : false , message: 'user doesnot found'});
     }
    }catch(e){
        return res.status(500).json({msg : "Internal sever error"})
    }
}