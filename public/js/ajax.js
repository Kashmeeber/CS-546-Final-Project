function errorCheck(firstName, lastName, emailAddress, password, confirmPassword) {
    console.log(1)
    if (!firstName || !lastName || !emailAddress || !password || !confirmPassword) {
      throw 'Error: All fields must be supplied.';
    }
    console.log(2)
    let regexNum = /^[0-9]*$/;
    if (!regexNum.test(firstName)){
        throw 'Error: first name must be a valid string';
    }

    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  
    if (firstName.length == 0 || firstName.length < 2 || firstName.length > 25) {
      throw 'Error: first name must be a valid string';
    }
    console.log(3)
    for (let i = 0; i < firstName.length; i++) {
      if (nums.includes(firstName[i])) {
        throw 'Error: first name cannot include numbers';
      }
    }
    console.log(4)
    if (lastName.length == 0 || lastName.length < 2 || lastName.length > 25) {
      throw 'Error: last name must be a valid string';
    }
    console.log(5)
    for (let i = 0; i < lastName.length; i++) {
      if (nums.includes(lastName[i])) {
        throw 'Error: last name cannot include numbers';
      }
    }
    console.log(6)
    if (!emailAddress.includes('@')) {
      throw 'Error: Email addres must include @';
    }
    console.log(7)
    let splitEmail = emailAddress.split('@');
    if (!splitEmail[1].includes('.')) {
      throw 'Error: Email address must include .____';
    }
    console.log(8)
    firstName = firstName.trim();
    lastName = lastName.trim();
    emailAddress = emailAddress.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();
  
    //REGEX SOURCE https://stackoverflow.com/questions/10557441/regex-to-allow-atleast-one-special-character-one-uppercase-one-lowercasein-an
  
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_!]).*$/;
    console.log(9)
    //figure out regex
    if (password.length == 0 || password.length < 8 || password.includes(' ')) {
      throw 'Error: Password must be at least 8 characters long and cannot include empty spaces';
    }
    console.log(10)
    if (!regex.test(password)) {
      throw 'Error: Password must include at least one capital letter, one number, and one special character';
    }
    console.log(11)
    if (password != confirmPassword) {
      throw 'Error: Password and Confirm Password must match';
    }
    console.log(12)
    return;
  }

(function($) {
    let myNewTaskForm = $('#registration-form'),
        firstNameInput = $('#firstNameInput'),
        lastNameInput = $('#lastNameInput'),
        emailAddressInput = $('#emailAddressInput'),
        passwordInput = $('#passwordInput'),
        confirmPasswordInput = $('#confirmPasswordInput'),
        registrationResult = $('#registrationResult');
    
    myNewTaskForm.submit(function(event) {
      event.preventDefault();
  
      let firstName = firstNameInput.val();
      console.log(firstName)
      let lastName = lastNameInput.val();
      console.log(lastName)
      let emailAddress = emailAddressInput.val();
      console.log(emailAddress)
      let password = passwordInput.val();
      console.log(password)
      let confirmPassword = confirmPasswordInput.val();
      console.log(confirmPassword)

      try {
        // let firstName = document.getElementById('firstNameInput');
        // let lastName = document.getElementById('lastNameInput');
        // let emailAddress = document.getElementById('emailAddressInput');
        // let password = document.getElementById('passwordInput');
        // let confirmPassword = document.getElementById('confirmPasswordInput');
  
        // errorCheck(
        //   firstName,
        //   lastName,
        //   emailAddress,
        //   password,
        //   confirmPassword
        // );
        if (!firstName || !lastName || !emailAddress || !password || !confirmPassword) {
            throw 'Error: All fields must be supplied.';
          }
          console.log(2)
          let regexNum = /^[0-9]*$/;
          let regexx = /.*[0-9].*/;
          let regexxx = /[\W_]+/
          
          if (regexNum.test(firstName)){
              throw 'Error: first name must be a valid string';
          }
            if (regexNum.test(lastName)){
                throw 'Error: last name must be a valid string';
            }
            if (regexx.test(firstName)){
                throw 'Error: first name must be a valid string';
            }
            if (regexx.test(lastName)){
                throw 'Error: last name must be a valid string';
            }
            if (regexxx.test(firstName)){
                throw 'Error: first name must be a valid string';
            }
            if (regexxx.test(lastName)){
                throw 'Error: last name must be a valid string';
            }
                
          if (!emailAddress.includes('@')) {
            throw 'Error: Email addres must include @';
          }
          let splitEmail = emailAddress.split('@');
          if (!splitEmail[1].includes('.')) {
            throw 'Error: Email address must include .____';
          }
          firstName = firstName.trim();
          lastName = lastName.trim();
          emailAddress = emailAddress.trim();
          password = password.trim();
          confirmPassword = confirmPassword.trim();
        
          //REGEX SOURCE https://stackoverflow.com/questions/10557441/regex-to-allow-atleast-one-special-character-one-uppercase-one-lowercasein-an
        
          let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_!]).*$/;
          //figure out regex
          if (password.length == 0 || password.length < 8 || password.includes(' ')) {
            throw 'Error: Password must be at least 8 characters long and cannot include empty spaces';
          }
          console.log(10)
          if (!regex.test(password)) {
            throw 'Error: Password must include at least one capital letter, one number, and one special character';
          }
          console.log(11)
          if (password != confirmPassword) {
            throw 'Error: Password and Confirm Password must match';
          }
      } catch (e) {
        event.preventDefault();
        registrationResult.html(e);
      }
        
        let requestConfig = {
          method: 'POST',
          url: '/register',
          contentType: 'application/json',
          data: JSON.stringify({
            firstNameInput: firstName,
            lastNameInput: lastName,
            emailAddressInput: emailAddress,
            passwordInput: password
          })
        };
        //CITATIONS for using .done and using data.indexof to find errors:https://api.jquery.com/jquery.ajax/
        //https://jsnlog.com/Documentation/HowTo/AjaxErrorHandling
        //https://stackoverflow.com/questions/68938716/ajax-call-which-return-a-file-or-a-partial-html-on-case-of-error-how-to-handle
        $.ajax(requestConfig).done(function(data) {
          if (data.indexOf('Error') >= 0) {
            registrationResult.html('You must enter valid inputs in all of the fields');
          } else {
            registrationResult.html('Success, you have registered the account.');
            myNewTaskForm[0].reset();
          }
        });
        
        // Prevent the default form submission action
        event.preventDefault();
        return false;
    });
  })(window.jQuery);