
    function submitNote(){
        const name = document.getElementById('note-id').value
        const description = document.getElementById('description-id').value
        const uri = document.getElementById('note-url-id').value
        httpRequestStaff("PUT",uri,JSON.stringify({name,description}), "'Team Note added with Sucess!!This page will reload in 3 seconds after you hit ok'")
        .then(data =>{
            setTimeout(function(){
                location.reload();
            },3000);
        })
        .catch(err => alert(err.message))

    }
    
    function submitstaff(element){
        const form_create_staff = document.querySelector('.createStaff-class')
        const idType = form_create_staff.querySelector('[name="idType"]').value
        const idNumber = form_create_staff.querySelector('[name="idNumber"]').value
        const name = form_create_staff.querySelector('[name="name"]').value
        const lastname = form_create_staff.querySelector('[name="lastname"]').value
        const gender = form_create_staff.querySelector('[name="gender"]').value
        const nationality = form_create_staff.querySelector('[name="nationality"]').value
        const email = form_create_staff.querySelector('[name="email"]').value
        const address = form_create_staff.querySelector('[name="address"]').value
        const postalcode = form_create_staff.querySelector('[name="postalcode"]').value
        const nss = form_create_staff.querySelector('[name="nss"]').value
        const profission = form_create_staff.querySelector('[name="profission"]').value
        const instituitionId = form_create_staff.querySelector('[name="instituitionId"]').value
        element.action = element.action + profission + document.getElementById('token-id').value
        if(!validateEmail(email)) {
            alert("invalid email")
            return false
        }
      //  const data = JSON.stringify({idType,idNumber,name,lastname,gender,nationality,email,address,
        //                            postalcode,nss})
        //const path =`/administrative/${instituitionId}/${profission}`
        //httpRequest("POST",path,data,instituitionId)
        return true        
    }
    function submitmedrecordgroup(){
        const form_create_medrecordgroup = document.querySelector('.createmedicalrecordgroup-class')
        const pathology = form_create_medrecordgroup.querySelector('[name="pathology"]').value
        const description = form_create_medrecordgroup.querySelector('[name="description"]').value
        const mainComplaint = form_create_medrecordgroup.querySelector('[name="mainComplaint"]').value
        const when = form_create_medrecordgroup.querySelector('[name="when"]').value
        const location = form_create_medrecordgroup.querySelector('[name="location"]').value
        const type = form_create_medrecordgroup.querySelector('[name="type"]').value
        const intensity = form_create_medrecordgroup.querySelector('[name="intensity"]').value
        const constancy = form_create_medrecordgroup.querySelector('[name="constancy"]').value
        const dispersal = form_create_medrecordgroup.querySelector('[name="dispersal"]').value
        var injuryChanges = form_create_medrecordgroup.querySelectorAll('[name="injuryChanges"]')
        injuryChanges = joinValues(injuryChanges)
        const injuryEvolution = form_create_medrecordgroup.querySelector('[name="injuryEvolution"]').value
        var trigger = form_create_medrecordgroup.querySelectorAll('[name="trigger"]')
        trigger  = joinValues(trigger)
        const prevTreatment = form_create_medrecordgroup.querySelector('[name="prevTreatment"]').value
        var others = form_create_medrecordgroup.querySelectorAll('[name="others"]')
        others= joinValues(others)
        return true
    }
    
    function submitImage(){
        var video =document.querySelector('video');
        if (navigator.mediaDevices) {
            // access the web cam
            navigator.mediaDevices.getUserMedia({video: true})
            // permission granted:
              .then(function(stream) {
                  if ("srcObject" in video) {
                      video.srcObject = stream;
                  } else {
                      // Avoid using this in new browsers, as it is going away.
                      video.src = window.URL.createObjectURL(stream);
                  }
                  video.onloadedmetadata = function(e) {
                      video.play();
                  };
                video.addEventListener('click', confirmImage);
              })
              // permission denied:
              .catch(function(error) {
                document.body.textContent = 'Could not access the camera. Error: ' + error.name;
            });
        }
    }
    function confirmImage(){
        var video =document.querySelector('video');
        var img = document.querySelector('img') || document.createElement('img');
        var context;
        var width = video.offsetWidth
          , height = video.offsetHeight;
  
        var canvas = canvas || document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
  
        context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, width, height);
  
        img.src = canvas.toDataURL('image/png');
        const image = document.getElementById('image-id')
        image.style.display = 'block'
        image.src = img.src
        const cancel = document.getElementById('cancel-image')
        cancel.style.display = 'block'
        video.srcObject = null;
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
    function cancelImage(){
        const image = document.getElementById('image-id')
        image.style.display = 'none'
        const cancel = document.getElementById('cancel-image')
        cancel.style.display = 'none'
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

    function submitdetailedmedicalrecord(element){
        var img_captured = document.getElementById('image-id')
        var data = new FormData(element)
        if(img_captured.src!=document.URL){
            document.getElementById('image-src').value = img_captured.src
            var blob = appendImagetoForm(img_captured.src)
            data.append('image_upload',blob,'cas.png')
        }
        httpRequestRecords("POST", element.action,data)
        .then(data =>{
            location.href = data
        })
        return false; 
    }

    function appendImagetoForm(ImageURL){
        // Split the base64 string in data and contentType
        var block = ImageURL.split(";");
        // Get the content type of the image
        var contentType = block[0].split(":")[1];// In this case "image/gif"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1];
        // Convert it to a blob to upload
        var blob = b64toBlob(realData, contentType);
        return blob         
    }


    function teamShow(){
        lookForBlockDivStaff()
        document.getElementById("staff-other-id").style.display='none'
        var teamDiv = document.getElementById("staff-teams-menu-option-id")
        teamDiv.style.display= 'block'
    }
    function notifShow(){
        lookForBlockDivStaff()
        document.getElementById("staff-other-id").style.display='none'
        var notifDiv = document.getElementById("staff-notification-menu-option-id")
        notifDiv.style.display= 'block'
    } 
    
    function personalInfoShow(){
        lookForBlockDivStaff()
        StaffUndoShortLayout();
        var infoDiv = document.getElementById("staff-info-menu-option-id")
        infoDiv.style.display= 'block'
    }

    function staffChangePasswordShow(){
      lookForBlockDivStaff()
      var showChangePassword = document.getElementById("change-password-menu-option-id")
      showChangePassword.style.display= 'block'
    } 

    function showdHideStaff(){
       var display = document.getElementById("staff-other-id") 
       if(display.style.display =='block') 
             display.style.display='none'
        else 
             display.style.display='block'     
      } 
//tobe improoved
    function showdHideStaffHist(){
  
        var display = document.getElementById("staff-hist-id") 
        if(display.style.display =='block') 
              display.style.display='none'
         else 
              display.style.display='block'   
    }  
    function hideOthers(id){
        var display = document.getElementById(i)
        display.style.display='none'
    }

    function StaffshortLayout(){
       document.getElementById("h-s-id").style.display="none"   
       document.getElementById("short-header-staff-id").style.display="block"
        //document.getElementById("footer-id").style.display="none"   
        //document.getElementById("short-footer-id").style.display="block"
       }
    
       function StaffUndoShortLayout(){
         document.getElementById("h-s-id").style.display="block"   
         document.getElementById("short-header-staff-id").style.display="none"
        //document.getElementById("footer-id").style.display="block"   
        //document.getElementById("short-footer-id").style.display="none"
       }
     
    function lookForBlockDivStaff(){
        StaffshortLayout();
        var divs = document.querySelectorAll(".staff-menu-option-class");
        var array = Array.prototype.slice.call(divs, 0);
        for (var i=0; i <array.length; i++) {
           display = divs[i].style.display;    
           if(display == 'block' ){
                divs[i].style.display = 'none'
                break
           }
        }
    }

  function addMemberToTeam(uri,id){
      var element = document.getElementById(id)
      var memberId = element.value

      httpRequestStaff("PUT",uri,JSON.stringify({memberId}), "Added With Success!!",element)
  }
  function comparateSignalsHowHide(){
      var div1 = document.getElementById("createNewDetailedMedicalRecordId").style
      var div2 = document.getElementById("comparateSignalsId").style
      var element= document.getElementById("compareOrCreateId")

      if(div1.display =='block'){
          div1.display='none'
          div2.display='block'
          element.innerText='Criar Nova Avaliação'
      }
      else{
        div1.display='block'
        div2.display='none'
        element.innerText='Comparar Sinais '
      }
           
      
  }

  function moveToBase(id){
    var base = document.getElementById("pivoId")
    var img = document.getElementById(id)
        base.style.display='block'
    document.getElementById('imgPivo').src=img.src
  }

  function moveToComparator(id){
    var base = document.getElementById("comparatorId")
    var img = document.getElementById(id)
        base.style.display='block'
    document.getElementById('imgComparator').src=img.src
  }


    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function httpRequestStaff(method, path, data,msg,element){
        return fetch(path, {
            method: method,
            body: data,
            headers:new Headers({'Content-Type': 'application/json','Accept': ''}),
            redirect: 'follow'
        })
        .then(resp => {
            if(resp.status != 200)
                throw new Error(resp.statusText)
            alert(msg)
            if(element!=null)
                element.value= ''   
            return resp.text()
        })
    }

    function httpRequestRecords(method, path, data){
        return fetch(path, {
            method: method,
            body: data,
            redirect: 'follow'
        })
        .then(resp => {
            if(resp.status != 200)
                throw new Error(resp.statusText)
            return resp.url
        })
    }
