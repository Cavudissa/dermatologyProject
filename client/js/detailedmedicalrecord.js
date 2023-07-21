function showPhotos(){
    lookBlockDiv(".detailed-medical-record-menu-option-class")
    var photosDiv = document.getElementById("detailed-medical-record-photos-menu-option-id")
    photosDiv.style.display= 'block'
}

function showInformation(){
    lookBlockDiv(".detailed-medical-record-menu-option-class")
    var infoDiv = document.getElementById("detailed-medical-record-menu-option-id")
    infoDiv.style.display= 'block'
}

function showNotes(){
    lookBlockDiv(".detailed-medical-record-menu-option-class")
    var infoDiv = document.getElementById("team-notes-menu-option-id")
    infoDiv.style.display= 'block'
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

function getCompareFiles(){
    var compareURI = document.getElementById('compareURI').value
    var token = document.getElementById('token').value
    var compare_checkbox = document.querySelectorAll('.compare')
    var ids = []
    for (i = 0; i < compare_checkbox.length; i++) {
        if (compare_checkbox[i].checked) {
            ids.push(compare_checkbox[i].value)
        }
    }
    var uri = `${compareURI}/${ids[0]}/${ids[1]}?accessToken=${token}` 
    document.getElementById("compareOrCreateId").href=uri; 
    return true;
}

function compareAlert(){
    var element= document.getElementById("compareOrCreateId")
    var count = 0;
    var compare_checkbox = document.querySelectorAll('.compare')
    for (i = 0; i < compare_checkbox.length; i++) {
        if (compare_checkbox[i].checked) {
            count = count +1;
        }
    }
    if(count ==2){
        element.style.display = 'block'
    }else{
        element.style.display = 'none'
    }
}

function joinValues(arr_values){
    var txt = ''
    for (i = 0; i < arr_values.length; i++) {
        if (arr_values[i].checked) {
            txt = txt + arr_values[i].value + " ";
            arr_values[0].value = txt
        }
    }
    return arr_values
}