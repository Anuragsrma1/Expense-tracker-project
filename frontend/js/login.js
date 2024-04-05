async function login(e) {
    e.preventDefault();
   
    const loginDetails = {
        email : e.target.email.value,
        password : e.target.password.value
    }
    console.log(loginDetails)

    try{
          const result = await axios.post('http://localhost:5501/user/login',loginDetails)
       console.log(result);
       if(result.data.success){
        alert('login successfully');
    //  console.log(login ,successfull);
       }
    }
    catch(e){
       console.log(e)
       alert(e.response.data.msg)
    }
}