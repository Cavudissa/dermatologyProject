
    function createAdministrative(){
        shortLayout();
        const form_create_administrative = document.querySelector('.createAdministrative-class')
            const name = form_create_administrative.querySelector('[name="name"]').value
            const instituitionnumber = form_create_administrative.querySelector('[name="instituitionnumber"]').value
            var address = form_create_administrative.querySelector('[name="address"]').value
            const zipCode = form_create_administrative.querySelector('[name="zipCode"]').value
            const city = form_create_administrative.querySelector('[name="city"]').value
            address = address + ", " + zipCode +", " +city
            const country = form_create_administrative.querySelector('[name="country"]').value
            const password = form_create_administrative.querySelector('[name="password"]').value
            const passwordr = form_create_administrative.querySelector('[name="passwordr"]').value
            const email = form_create_administrative.querySelector('[name="email"]').value
            
            if(password !== passwordr){
                alert("Passwords must match")
                return false
            }
            if(!validateEmail(email)) {
                alert("invalid email")
                return false
            }
            //const data = JSON.stringify({name,instituitionnumber,address,country,password,email})
            //httpRequestAdministrative("POST","/administrative",data) 

    }

    function loginAdministrative(element){
        const form_login_administrative = document.querySelector(".loginAdministrative-class")
        const password = form_login_administrative.querySelector('[name="password"]').value
        const email = form_login_administrative.querySelector('[name="email"]').value
        
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

  function showdHideAdministrative(id){
    var divs = document.querySelectorAll(".administrative-show-hide");
    var array = Array.prototype.slice.call(divs, 0);
    for (var i=0; i <array.length; i++) {
         if(divs[i].id==id)
             divs[i].style.display = 'block '
         else    
            divs[i].style.display = 'none'
           
       }
  } 

  function createPatientMenu(){
    lookForBlockDiv()
    var createPatientDiv = document.getElementById("create-patient-menu-option-id")
    createPatientDiv.style.display= 'block'
    }
   function createStaffMemberMenu(){
    lookForBlockDiv()
    var createTeamDiv = document.getElementById("create-staff-member-menu-option-id")
    createTeamDiv.style.display= 'block'
   } 

   function getInfoMenu(){
    lookForBlockDiv();
    UndoShortLayout();
    var infoDiv = document.getElementById("get-info-menu-option-id")
    infoDiv.style.display= 'block'
   } 

   function createTeamMenu(){
    lookForBlockDiv()
    var createTeamDiv = document.getElementById("create-team-menu-option-id")
    createTeamDiv.style.display= 'block'

   }
   function addPeople(){
    lookForBlockDiv()
    var addPeople = document.getElementById("add-people-menu-option-id")
    addPeople.style.display= 'block'
   }

   function showSharePatientMedicalRecord(){
       document.getElementById("add-staff-member-id").style.display="none"
       document.getElementById("share-patient-id").style.display="block"
    
   }
   function showAddStaffMember(){
    document.getElementById("share-patient-id").style.display="none"   
    document.getElementById("add-staff-member-id").style.display="block"

   }
   function shortLayout(){
    document.getElementById("header-id").style.display="none"   
    document.getElementById("short-header-id").style.display="block"
    document.getElementById("footer-id").style.display="none"   
    document.getElementById("short-footer-id").style.display="block"
   }

   function UndoShortLayout(){
    document.getElementById("header-id").style.display="block"   
    document.getElementById("short-header-id").style.display="none"
    document.getElementById("footer-id").style.display="block"   
    document.getElementById("short-footer-id").style.display="none"
   }



 function lookForBlockDiv(){
    shortLayout(); 
    var divs = document.querySelectorAll(".admnistrative-menu-option-class");
    var array = Array.prototype.slice.call(divs, 0);
    var infoDiv = document.getElementById("get-info-menu-option-id")
    var bORn= infoDiv.style.display;
    for (var i=0; i <array.length; i++) {
       display = divs[i].style.display;    
       if(display == 'block' ){
            divs[i].style.display = 'none'
            break
       }
    }
}
   
   function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    function removeMember(email,role){
        if(role==='Enfermeiro'){
            role = 'nurse'
        }else
            role = 'doctor'
        httpRequestLogin('DELETE',location.href,JSON.stringify({role:role,email:email}))
        .then(data =>{
            setTimeout(function(){
                location.reload();
            },3000);
        })
        .catch(err => alert('Não conseguimos remover o membro!'))
        return false
    }

    function httpRequestLogin(method, path, data){
        return fetch(path, {
            method: method,
            body: data,
            redirect: 'follow',
            headers:new Headers({'Content-Type': 'application/json','Accept': ''})
        })
        .then(resp => {
            if(resp.status != 200)
                throw new Error(resp.statusText)
            return resp.json()
        })
        .then(url =>{
            return url.url
        })
    }