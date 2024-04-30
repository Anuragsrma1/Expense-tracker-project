async function signup(e){
    try{
         e.preventDefault();
         console.log(e.target.email.value);
         const signupDetails = {
            username : e.target.username.value,
            email : e.target.email.value,
            password : e.target.password.value
         }
      console.log(signupDetails);
      const response = await axios.post('http://localhost:5501/user/createUser',signupDetails)
      console.log(response);
      if(response.status === 201){
            //   console.log('Signup successfull');
        window.location.href = "/frontend/login.html"
      }else{
        throw new Error('failed to login');
      }
    }catch(err){
       document.body.innerHTML += `<div style= "color:red;"> ${err} <div> `
    }
}