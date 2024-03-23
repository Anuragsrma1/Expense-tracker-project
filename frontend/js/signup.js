async function signup(e){

    try{
        e.preventdefault();
        console.log(e.target.email.value);

        const signupdetails= {
            username : e.target.username.value,
            email : e.target.email.value,
            password :  e.target.password.value,
          confirm_password : e.target.confirm_password.value
        }
        console.log(signupdetails);
   const response = await axios.post('http:localhost:3000/user/signup',signupdetails)
   if(response.status === 201){
    window.location.href = "../login/login.html"
   }else{
    throw new Error('failed to login');
   }
  }catch(err){
    document.body.innerHTML += '<div style = "color:red;" >${err} <div>';
  }
}