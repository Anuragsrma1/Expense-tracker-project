console.log('start');
async function signup(e){
  console.log('end');
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const signupdetails= {
            username : e.target.username.value,
            email : e.target.email.value,
            password :  e.target.password.value,
        }
        
        console.log(signupdetails);
   const response = await axios.post('http//localhost:3000/user/signup',signupdetails)
   console.log(response);
   if(response.status === 201){
    window.location.href = "/login.html"
   }else{
    throw new Error('failed to login');
   }
  }catch(err){
    document.body.innerHTML += `<div style = "color:red;" >${err} <div>`;
  }
}