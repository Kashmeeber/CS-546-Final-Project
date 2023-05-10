(function ($) {
  let myNewTaskForm = $('#registration-form'),
    firstNameInput = $('#firstNameInput'),
    lastNameInput = $('#lastNameInput'),
    emailAddressInput = $('#emailAddressInput'),
    passwordInput = $('#passwordInput'),
    confirmPasswordInput = $('#confirmPasswordInput'),
    registrationResult = $('#registrationResult');

  myNewTaskForm.submit(function (event) {
    event.preventDefault();

    let firstName = firstNameInput.val();
    let lastName = lastNameInput.val();
    let emailAddress = emailAddressInput.val();
    let password = passwordInput.val();
    let confirmPassword = confirmPasswordInput.val();

    try {
      if (!firstName || !lastName || !emailAddress || !password || !confirmPassword) {
        throw 'Error: All fields must be supplied.';
      }
      let regexNum = /^[0-9]*$/;
      let regexx = /.*[0-9].*/;
      let regexxx = /[\W_]+/; //got from online source regex for at least 1 special character

      if (regexNum.test(firstName)) {
        throw 'Error: first name must be a valid string';
      }
      if (regexNum.test(lastName)) {
        throw 'Error: last name must be a valid string';
      }
      if (regexx.test(firstName)) {
        throw 'Error: first name must be a valid string';
      }
      if (regexx.test(lastName)) {
        throw 'Error: last name must be a valid string';
      }
      if (regexxx.test(firstName)) {
        throw 'Error: first name must be a valid string';
      }
      if (regexxx.test(lastName)) {
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
      if (password.length == 0 || password.length < 8 || password.includes(' ')) {
        throw 'Error: Password must be at least 8 characters long and cannot include empty spaces';
      }
      if (!regex.test(password)) {
        throw 'Error: Password must include at least one capital letter, one number, and one special character';
      }
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
    $.ajax(requestConfig).done(function (data) {
      if (data.indexOf('Error') >= 0) {
        registrationResult.html('You must enter valid inputs in all of the fields');
      } else {
        registrationResult.html('Success, you have registered the account.');
        myNewTaskForm[0].reset();
      }
    });
    event.preventDefault();
    return false;
  });
})(window.jQuery);
