async function loginUser(e) {
    e.preventDefault();
    
    const loginDetails = {
        email : e.target.email.value,
        password : e.target.password.value
    }
    console.log(loginDetails)

    try{
          const result = await axios.post('http:localhost:3000/user/login',loginDetails)
       console.log(result);
       if(result.data.success){
        alert('login successfully');

       }
    }
    catch(e){
       console.log(e)
       alert(e.response.data.msg)
    }
}