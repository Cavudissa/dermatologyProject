function showMedicalHistory(){
    lookBlockDiv(".shared-patient-menu-option-class")
    var showMedicalDiv = document.getElementById("medical-history-menu-option-id")
    showMedicalDiv.style.display= 'block'
}

function showFamilyHistory(){
    lookBlockDiv(".shared-patient-menu-option-class")
    var showFamilyDiv = document.getElementById("family-history-menu-option-id")
    showFamilyDiv.style.display= 'block'
}

function showSocialHistory(){
    lookBlockDiv(".shared-patient-menu-option-class")
    var showSocialDiv = document.getElementById("social-history-menu-option-id")
    showSocialDiv.style.display= 'block'
}

function showSexualHistory(){
    lookBlockDiv(".shared-patient-menu-option-class")
    var showSexuallDiv = document.getElementById("sexual-history-menu-option-id")
    showSexuallDiv.style.display= 'block'
}

function showPersonalInfo(){
    lookBlockDiv(".shared-patient-menu-option-class")
    var showPatientDiv = document.getElementById("patient-menu-option-id")
    showPatientDiv.style.display= 'block'
}

function lookBlockDiv(elementClass){
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