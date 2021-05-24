<script src="https://cdn.jsdelivr.net/npm/@yaireo/tagify@3.1.0/dist/tagify.min.js"></script>


function myFunction() {
    var x = document.getElementById("myInput");
    var password_eye = document.getElementById("password_eye");

    if (x.type === "password") {
      x.type = "text";
      password_eye.style.color = "rgb(81, 81, 175)"
    } else {
      x.type = "password";
      password_eye.style.color = "rgba(0,0,0,0.2)"
    }
  }    

  heddin_doctor_div() ;
  function heddin_doctor_div(){
      var doctor_div = document.getElementById("doctor_div");
      doctor_div.style.display = "none" ;
  }
 
  function signup_check(){
      var doctor = document.querySelector('input[name=doctor]');
      var user = document.getElementsByClassName("user");
      if(doctor.checked == true){
          console.log("if working")
          user.style.display = "none"
      }else{
          console.log("else working")
          document.getElementById("myForm").submit();
      }
  }       

    var achivement = document.querySelector('input[name=achivement]');
    new Tagify(achivement)

    var hospital = document.querySelector('input[name=hospital]');
    new Tagify(hospital)

    var qualification = document.querySelector('input[name=qualification]');
    new Tagify(qualification)

    var awards = document.querySelector('input[name=awards]');
    new Tagify(awards)

    var specification = document.querySelector('input[name=specification]');
    new Tagify(specification)

