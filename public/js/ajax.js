// (function($){
//     let myNewTaskForm = $('#registration-form'), 
//     firstNameInput = $('#firstNameInput'),
//     lastNameInput = $('#lastNameInput'),
//     emailAddressInput = $('#emailAddressInput'),
//     passwordInput = $('#passwordInput');
//     myNewTaskForm.submit(function (event) {
//         event.preventDefault();
    
//         let firstName = firstNameInput.val();
//         let lastName = lastNameInput.val();
//         let emailAddress = emailAddressInput.val();
//         let password = passwordInput.val();
//         // let confirmPassword = confirmPasswordInput.val();

    
//         if (firstName && lastName && emailAddress && password) {
//           //set up AJAX request config
//           let requestConfig = {
//             method: 'POST',
//             url: '/register',
//             contentType: 'application/json',
//             data: JSON.stringify({
//                 firstNameInput: firstName,
//                 lastNameInput: lastName,
//                 emailAddressInput: emailAddress,
//                 passwordInput: password
//             })
//           };
//           //AJAX Call. Gets the returned HTML data, binds the click event to the link and appends the new todo to the page
//           $.ajax(requestConfig).then(function () {
//             console.log(1)
//             window.location.href = "/login"
//             console.log(2)
//           });
//         }
//       });
// })(window.jQuery)