const form = document.getElementById("formId");
form.addEventListener("submit",forgotpassword);

function forgotpassword(e) {
    e.preventDefault();
    // console.log('line 6>>',e.target.name);
    const form = new FormData(e.target);
    //   console.log('line 5',form);
    const userDetails = {
        email: form.get("email"),
  

    }
    // console.log('i am user details',userDetails);
    axios.post('http://127.0.0.1:5501/password/forgotpassword',userDetails).then(response => {
        console.log('line 16',response);
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
