// functions that need to be done
// for tripplannning.handlebars there needs to be a function that shows a hidden div on click
let registrationForm = document.getElementById('registration-form');
let loginForm = document.getElementById('login-form');
let error = document.getElementById('error');
let serverErr = document.getElementById('serverErr');
let createTrip = document.getElementById('createTrip');

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

function errorCheck3(tripName,
    startLocation,
    startDate,
    startTime,
    endLocation,
    endDate,
    endTime,
    stops,
    toDo,
    usersAllowed = []) {
        console.log(1)
        if (
            !tripName ||
            !startLocation ||
            !startDate ||
            !startTime ||
            !endLocation ||
            !endDate ||
            !endTime ||
            !stops ||
            !toDo
          ) {
            throw 'Error: All fields need to have valid values';
          }
          if (Number.isNaN(parseInt(tripName)) || tripName.trim().length == 0) {
            throw 'Error: Must provide the trip name as valid nonempty string';
          }
          if (typeof startLocation != 'string' || startLocation.trim().length == 0) {
            throw 'Error: Must provide the start location as valid nonempty string';
          }
          if (typeof startDate != 'string' || startDate.trim().length == 0) {
            throw 'Error: Must provide start date as valid nonempty string';
          }
          if (typeof endLocation != 'string' || endLocation.trim().length == 0) {
            throw 'Error: Must provide the end location as valid nonempty string';
          }
          console.log(1.5);
        //   if (!Array.isArray(toDo) || toDo.length == 0) {
        //     throw 'Error: Must provide to-do list as valid nonempty array';
        //   }
          if (typeof endDate != 'string' || endDate.trim().length == 0) {
            throw 'Error: Must provide end date as valid nonempty string';
          }
          if (typeof startTime != 'string' || startTime.trim().length == 0) {
            throw 'Error: Must provide start time as valid nonempty string';
          }
          if (typeof endTime != 'string' || endTime.trim().length == 0) {
            throw 'Error: Must provide end time as valid nonempty string';
          }
        //   if (!Array.isArray(stops)) {
        //     throw 'You must provide an array of all stops on your trip';
        //   }
          // if (!Array.isArray(usersAllowed)) {
          //   throw 'You must provide an array of all users allowed on your trip';
          // }
          if (startLocation == endLocation) {
            throw 'Start location cannot be the same as end location';
          }
          if (startTime == endTime) {
            throw 'Start time cannot be the same as end time';
          }
          if (startDate == endDate) {
            throw 'Start date cannot be the same as end date';
          }
          console.log(2)
          tripName = tripName.trim();
          startLocation = startLocation.trim();
          startDate = startDate.trim();
          endLocation = endLocation.trim();
          endDate = endDate.trim();
          startTime = startTime.trim();
          endTime = endTime.trim();
        //   stops = stops.map((stop) => stop.trim());
        //   toDo = toDo.map((todo) => todo.trim());
        //   if(usersAllowed.length !== 0) {
        //     usersAllowed = usersAllowed.map((user) => user.trim());
        //   } else {
        //     usersAllowed = [];
        //   }
          let st = startTime.split(':');
          let et = endTime.split(':');
          if (st.length != 2 || st[0].length != 2 || st[1].length != 2) {
            throw 'Error: Must provide start time in HH:MM format';
          }
          if (et.length != 2 || et[0].length != 2 || et[1].length != 2) {
            throw 'Error: Must provide end time in HH:MM format';
          }
          if (st[0] * 1 < 0 || st[0] * 1 > 23) {
            throw 'Error: Must provide start time in HH:MM format';
          }
          if (st[1] * 1 < 0 || st[1] * 1 > 59) {
            throw 'Error: Must provide start time in HH:MM format';
          }
          if (et[0] * 1 < 0 || et[0] * 1 > 23) {
            throw 'Error: Must provide end time in HH:MM format';
          }
          if (et[1] * 1 < 0 || et[1] * 1 > 59) {
            throw 'Error: Must provide end time in HH:MM format';
          }
          let sd = startDate.split('/');
          let ed = endDate.split('/');
          let currentYear = new Date();
          let newCurrentYear = currentYear.getFullYear();
          if (sd[2] < currentYear && ed[2] > newCurrentYear + 2) {
            throw 'The start date cannot be in the past and the end date cannot be more than 2 years than today';
          }
          if (sd.length != 3 || sd[0].length != 2 || sd[1].length != 2 || sd[2].length != 4) {
            throw 'Error: Must provide start date in MM/DD/YYYY format';
          }
          if (sd[0] * 1 < 1 || sd[0] * 1 > 12) {
            throw 'Error: Must provide start date in MM/DD/YYYY format';
          }
          if (sd[1] * 1 < 1 || sd[1] * 1 > 31) {
            throw 'Error: Must provide start date in MM/DD/YYYY format';
          }
          if (sd[2] * 1 < 1900 || sd[2] * 1 > ed[2] * 1) {
            throw 'Error: Must provide start date in MM/DD/YYYY format';
          }
          if (ed.length != 3 || ed[0].length != 2 || ed[1].length != 2 || ed[2].length != 4) {
            throw 'Error: Must provide end date in MM/DD/YYYY format';
          }
          if (ed[0] * 1 < 1 || ed[0] * 1 > 12) {
            throw 'Error: Must provide end date in MM/DD/YYYY format';
          }
          if (ed[1] * 1 < 1 || ed[1] * 1 > 31) {
            throw 'Error: Must provide end date in MM/DD/YYYY format';
          }
          if (ed[2] * 1 < sd[2] * 1 || ed[2] * 1 > ed[2] * 1 + 1) {
            throw 'Error: Must provide end date in MM/DD/YYYY format';
          }
          if (sd > ed) {
            throw 'Error: Start date must be set to a date before end date';
          }

            let splitToDo = tripInfo.toDoInput.split(',')
            let splitStops = tripInfo.stopsInput.split(',')
        
            for(let i = 0; i < splitToDo.length; i++) {
              if(typeof splitToDo[i] != "string"){
                throw 'One of the to-do items is not a valid string'
              }
              
            }
            for(let i = 0; i < splitStops.length; i++) {
              if(typeof splitStops[i] != "string"){
                throw 'One of the stops is not a valid string'
              }
            }

            console.log(3)
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

  if(createTrip){
    createTrip.addEventListener('submit', (event) => {
        try{
            serverErr.innerHTML = '';
            error.hidden = true;
            error.innerHTML = '';
            let tripName = document.getElementById('tripNameInput');
            let startLocation = document.getElementById('startLocationInput');
            let startDate = document.getElementById('startDateInput');
            let startTime = document.getElementById('startTimeInput');
            let endLocation = document.getElementById('endLocationInput');
            let endDate = document.getElementById('endDateInput');
            let endTime = document.getElementById('endTimeInput');
            let stops = document.getElementById('stopsInput');
            let toDo = document.getElementById('toDoInput');
            let usersAllowed = document.getElementById('usersAllowedInput');
            errorCheck3(tripName.value, startLocation.value, startDate.value, startTime.value, endLocation.value, 
                endDate.value, endTime.value, stops.value, toDo.value, usersAllowed.value);

        }catch(e){
            event.preventDefault();
            serverErr.innerHTML = '';
            error.hidden = false;
            error.innerHTML = e;

        }

    });
}
