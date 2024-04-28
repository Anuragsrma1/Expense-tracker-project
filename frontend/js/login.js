async function login(e) {
    e.preventDefault();
   
    const loginDetails = {
        email : e.target.email.value,
        password : e.target.password.value
    }
    console.log(loginDetails)

    try{
          const response = await axios.post('http://localhost:5501/user/login',loginDetails)
    //    console.log(result);
    //    if(result.data.success){
    //     alert('login successfully');
     //  console.log(login ,successfull);
     alert(response.data.message)
            console.log(response.data)
    localStorage.setItem('token', response.data.token)
    window.location.href = "/frontend/expense.html"
       }
    
    catch(e){
       console.log(e)
       alert(e.response.data.msg)
    }
}