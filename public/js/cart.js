// functions that need to be done
// for tripplannning.handlebars there needs to be a function that shows a hidden div on click
let registrationForm = document.getElementById('registration-form');
let loginForm = document.getElementById('login-form');
let error = document.getElementById('error');
let serverErr = document.getElementById('serverErr');

function errorCheck(firstName, lastName, emailAddress, password, confirmPassword) {
    firstName = firstName.trim();
    lastName = lastName.trim();
    emailAddress = emailAddress.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();
  
    if(!firstName || !lastName || !emailAddress || !password || !confirmPassword){
      throw 'Error: All fields must be supplied.'
    }
  
    let nums = [1,2,3,4,5,6,7,8,9,0];
    
    if(firstName.length == 0  || firstName.length < 2 || firstName.length > 25){
      throw 'Error: first name must be a valid string'
    }
    for(let i=0; i<firstName.length; i++){
      if(nums.includes(firstName[i])){
        throw 'Error: first name cannot include numbers'
      }
    }
  
    if(lastName.length == 0  || lastName.length < 2 || lastName.length > 25){
      throw 'Error: last name must be a valid string'
    }
    for(let i=0; i<lastName.length; i++){
      if(nums.includes(lastName[i])){
        throw 'Error: last name cannot include numbers'
      }
    }
  
    if(!emailAddress.includes("@")){
      throw 'Error: Input valid email address';
    }
    let splitEmail = emailAddress.split("@");
    if(!splitEmail[1].includes(".")){
      throw 'Error: Input valid email address';
    }
    //REGEX SOURCE https://stackoverflow.com/questions/10557441/regex-to-allow-atleast-one-special-character-one-uppercase-one-lowercasein-an
  
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_!]).*$/
    
    //figure out regex
    if(password.length == 0 || password.length < 8 || password.includes(" ")){
      throw 'Error: must input valid password';
    }
    if(!(regex.test(password))) {
      throw 'Error: Must be valid password syntax';
    }
  
    if(password != confirmPassword){
        throw 'Error: Password and Confirm Password must match';
    }
    return;
}

function errorCheck2(emailAddress, password) {
    emailAddress = emailAddress.trim();
    password = password.trim();

  
    if(!emailAddress || !password){
      throw 'Error: All fields must be supplied.'
    }
  
    
    if(!emailAddress.includes("@")){
      throw 'Error: Input valid email address';
    }
    let splitEmail = emailAddress.split("@");
    if(!splitEmail[1].includes(".")){
      throw 'Error: Input valid email address';
    }
    //REGEX SOURCE https://stackoverflow.com/questions/10557441/regex-to-allow-atleast-one-special-character-one-uppercase-one-lowercasein-an
  
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_!]).*$/
    
    //figure out regex
    if(password.length == 0 || password.length < 8 || password.includes(" ")){
      throw 'Error: must input valid password';
    }
    if(!(regex.test(password))) {
      throw 'Error: Must be valid password syntax';
    }

    return;
}

if(registrationForm){
    registrationForm.addEventListener('submit', (event) => {
        try{
            serverErr.innerHTML = '';
            error.hidden = true;
            error.innerHTML = '';
            let firstName = document.getElementById('firstNameInput');
            let lastName = document.getElementById('lastNameInput');
            let emailAddress = document.getElementById('emailAddressInput');
            let password = document.getElementById('passwordInput');
            let confirmPassword = document.getElementById('confirmPasswordInput');

            errorCheck(firstName.value, lastName.value, emailAddress.value, 
                password.value, confirmPassword.value);

        }catch(e){
            event.preventDefault();
            serverErr.innerHTML = '';
            error.hidden = false;
            error.innerHTML = e;

        }
    });
  }

  if(loginForm){
    loginForm.addEventListener('submit', (event) => {
        try{
            serverErr.innerHTML = '';
            error.hidden = true;
            error.innerHTML = '';

            let emailAddress = document.getElementById('emailAddressInput');
            let password = document.getElementById('passwordInput');

            errorCheck2(emailAddress.value, password.value);

        }catch(e){
            event.preventDefault();
            serverErr.innerHTML = '';
            error.hidden = false;
            error.innerHTML = e;

        }
    });
  }
