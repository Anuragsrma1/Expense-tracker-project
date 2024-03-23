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
        const { username, email,password,confirm_password} = req.body;

         console.log('email',email);
         if(isstringinvalid(username) || isstringinvalid(email) || isstringinvalid(password)
         || isstringinvalid(confirm_password) )
           {   
        return res.status(400).json({err : "Bad parameters , something is missing"})    
     }

    await User.create({username,email,password,confirm_password})
        res.status(201).json({message : 'Successfully create new user'})    

         }catch(e){
         return res.status(500).json({msg : "Internal server error"})
    }
}