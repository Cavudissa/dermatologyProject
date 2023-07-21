function loginParticular(element){
    const form_login_particular = document.querySelector(".loginParticular-class")
        const password = form_login_particular.querySelector('[name="password"]').value
        const email = form_login_particular.querySelector('[name="email"]').value
        
        if(!validateEmail(email)) {
            alert("invalid email")
            return false
        }
        httpRequestLogin('POST',element.action,JSON.stringify({password:password,email:email}))
        .then(data =>{
            location.href = data
        })
        .catch(err => alert('Login Failed'))
        return false

}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
