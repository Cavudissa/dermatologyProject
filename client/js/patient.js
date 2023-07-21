

function createPatient(){

    const form_create_patient = document.querySelector('.createPatient-class')
    const idType = form_create_patient.querySelector('[name="idType"]').value
    const idNumber = form_create_patient.querySelector('[name="idNumber"]').value
    const name = form_create_patient.querySelector('[name="name"]').value
    const lastname = form_create_patient.querySelector('[name="lastname"]').value
    const gender = form_create_patient.querySelector('[name="gender"]').value
    const nationality = form_create_patient.querySelector('[name="nationality"]').value
    const email = form_create_patient.querySelector('[name="email"]').value
    const address = form_create_patient.querySelector('[name="address"]').value
    const postalcode = form_create_patient.querySelector('[name="postalcode"]').value
    const maritalstatus = form_create_patient.querySelector('[name="maritalstatus"]').value
    const nif = form_create_patient.querySelector('[name="nif"]').value
    const birthdate = form_create_patient.querySelector('[name="birthdate"]').value
    const phonenumber = form_create_patient.querySelector('[name="phonenumber"]').value
    const cityofbirth = form_create_patient.querySelector('[name="cityofbirth"]').value
    const countrybirth = form_create_patient.querySelector('[name="countrybirth"]').value
    const teamID = form_create_patient.querySelector('[name="teamID"]').value
    const instituitionId = form_create_patient.querySelector('[name="instituitionId"]').value


    if(!validateEmail(email)) {
        alert("invalid email")
        return false; 
    }
    return true;
}
                                           
function showDetailedInfo(){
    var element = document.getElementById("show-detailed-info-id")
        element.style.display= 'block'  
} 

function showPatientNotification(){
    lookPatientBlockDiv(".patient-menu-option-class")
    var showFamilyDiv = document.getElementById("notification-menu-option-id")
    showFamilyDiv.style.display= 'block'

}

function closeDetailedInfo(){
    var element = document.getElementById("show-detailed-info-id")
        element.style.display= 'none'  
}   
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function httpRequest(method, path, data,msg,element){
    return fetch(path, {
        method: method,
        body: data,
        headers:new Headers({'Content-Type': 'application/json','Accept': ''}),
        redirect: 'follow'
    })
    .then(resp => {
        if(resp.status != 200)
            return new Error(resp.statusText)
        alert(msg)
        if(element!=null)
            element.value= ''   
        return resp.text()
    })
}

function acceptShare(uri,teamId){
    httpRequest('PUT',uri,JSON.stringify({teamId}),'Request accepted with success... Reload incoming')
    .then(data =>{
        setTimeout(function(){
            location.reload();
        },3000);
    })
    .catch(err => alert(err.message))
   
}


function revokePermission(shareId){
    var token = document.getElementById('token').value;
    var revokeUrl = document.getElementById('revokeUrl').value;
    var url = `${revokeUrl}${shareId}${token}`
    httpRequestLogin('DELETE',url,JSON.stringify({shareId:shareId}))
    .then(data =>{
        alert('The page will reload')
        location.reload()
    })
    .catch(err => alert('Delete failed'))
    return false
}

function showPatientMedicalHistory(){
    lookPatientBlockDiv(".patient-menu-option-class")
    var showMedicalDiv = document.getElementById("medical-history-menu-option-id")
    showMedicalDiv.style.display= 'block'
}

function showPatientFamilyHistory(){
    lookPatientBlockDiv(".patient-menu-option-class")
    var showFamilyDiv = document.getElementById("family-history-menu-option-id")
    showFamilyDiv.style.display= 'block'
}

function showPatientSocialHistory(){
    lookPatientBlockDiv(".patient-menu-option-class")
    var showSocialDiv = document.getElementById("social-history-menu-option-id")
    showSocialDiv.style.display= 'block'
}

function showChangePassword(){
  lookPatientBlockDiv(".patient-menu-option-class")
  var showChangePassword = document.getElementById("change-password-menu-option-id")
  showChangePassword.style.display= 'block'
}

function showPatientSexualHistory(){
    lookPatientBlockDiv(".patient-menu-option-class")
    var showSexuallDiv = document.getElementById("sexual-history-menu-option-id")
    showSexuallDiv.style.display= 'block'
}

function showPatientPersonalInfo(){
    lookPatientBlockDiv(".patient-menu-option-class")
    patientUndoShortLayout();
    var showPatientDiv = document.getElementById("patient-personal-menu-option-id")
    showPatientDiv.style.display= 'block'
}

function showdHidePatient(id){
    var divs = document.querySelectorAll(".patient-show-hide");
    var array = Array.prototype.slice.call(divs, 0);
    for (var i=0; i <array.length; i++) {
         if(divs[i].id==id)
             divs[i].style.display = 'block '
         else    
            divs[i].style.display = 'none'
           
       }
  } 

function patientshortLayout(){
    document.getElementById("header-patient-id").style.display="none"   
    document.getElementById("short-header-patient-id").style.display="block"
    //document.getElementById("footer-id").style.display="none"   
    //document.getElementById("short-footer-id").style.display="block"
   }

   function patientUndoShortLayout(){
    document.getElementById("header-patient-id").style.display="block"   
    document.getElementById("short-header-patient-id").style.display="none"
    //document.getElementById("footer-id").style.display="block"   
    //document.getElementById("short-footer-id").style.display="none"
   }

function lookPatientBlockDiv(elementClass){
    patientshortLayout();
    var divs = document.querySelectorAll(elementClass);
    var array = Array.prototype.slice.call(divs, 0);
    for (var i=0; i <array.length; i++) {
       display = divs[i].style.display;    
       if(display == 'block' ){
            divs[i].style.display = 'none'
            break
       }
    }
}
