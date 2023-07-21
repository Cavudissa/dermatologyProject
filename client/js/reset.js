function resetPassword(){
  const form_reset_password = document.querySelector('.reset-class')
  const password = form_reset_password.querySelector('[name="password"]').value
  const passwordr = form_reset_password.querySelector('[name="repeat_password"]').value
  if(password !== passwordr){
    alert("Passwords must match")
    return false
  }
  return true
}