function showTeamNotes(){
    lookBlockDiv(".medical-record-menu-option-class")
    var teamNoteslDiv = document.getElementById("team-notes-menu-option-id")
    teamNoteslDiv.style.display= 'block'
}

function showReport(){
    lookBlockDiv(".medical-record-menu-option-class")
    var reportDiv = document.getElementById("medical-record-report-menu-option-id")
    reportDiv.style.display= 'block'
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