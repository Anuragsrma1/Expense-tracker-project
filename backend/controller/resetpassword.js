const User = require('../models/users');
const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const forgotPassword = require('../models/forgotpassword');
require('dotenv').config();

const forgotpassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });
        console.log(user);

        if (user) {
            const id = uuid.v4();
            console.log(user.id);
            await forgotPassword.create({ id, active: true,userId:user.id });

            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.EMAIL_API_KEY;
            console.log('api key>>>',apiKey.apiKey)
            const transEmailApi = new Sib.TransactionalEmailsApi();
            
          console.log('transEmailApi',transEmailApi);
            const sender = {
                email: 'anuragsharma0140@gmail.com',
                name: 'anurag'
            }
            const receiver = [{
                email:'anurag.sharma0230@gmail.com'
            }];
               await transEmailApi.sendTransacEmail({
                sender,
                to: receiver,
                subject: fogotPassword,
                textContent:'Follow the link and reset the password',
                htmlContent: `<h1>click on the link below to reset the password</h1><br> 
                 <a href="http://localhost:5501/password/resetpassword/${id}">Reset your password</a>`,
                        })
       
                console.log('Link to reset password sent to your mail')
                return res.status(202).json({ success: true, message: "Link to reset password sent to your mail" });
            
            }
         else {
            throw new Error('User Doesnt exist');
        }

    } catch (err) {
        console.error(err);
        if (err.status === 401) {
            return res.status(401).json({ message: "Unauthorized: Invalid API key", success: false });
        } else {
            return res.status(500).json({ message: "Failed to send reset password email", success: false });
        }
    }
}
const resetpassword = (req, res) => {
    const id =  req.params.id;
    forgotPassword .findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                    </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        forgotPassword .findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}