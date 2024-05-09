function forgotpassword(e) {
    e.preventDefault();
    console.log(e.target.name);
    const form = new FormData(e.target);

    const userDetails = {
        email: form.get("email"),
        password: form.get("password")

    }
    console.log(userDetails);
    axios.post('http://localhost:5501/password/forgotpassword',userDetails).then(response => {
        if(response.status === 202){
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userDetails', JSON.stringify(response.data.user))
            window.location.href = "/frontend/expense.html";

        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}
function forgotpassword() {
  
    window.location.href = "/frontend/forgotpassword.html";
}