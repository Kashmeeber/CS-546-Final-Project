// functions that need to be done

// const { create } = require('handlebars');
// import create from 'handlebars';


// for tripplannning.handlebars there needs to be a function that shows a hidden div on click
let registrationForm = document.getElementById('registration-form');
let loginForm = document.getElementById('login-form');
let error = document.getElementById('error');
let serverErr = document.getElementById('serverErr');
let createTrip = document.getElementById('createTrip');
let createItinerary = document.getElementById('createItinerary');
let promptQuestion1 = document.getElementById('promptQuestion1');


//Taken and modified from Google API documentation 
function Map() {
  try {
     let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: { lat: 40.743992, lng: -74.032364 }, // Hoboken
      streetViewControl: false
    });
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('panel'),
    });
    directionsRenderer.addListener('directions_changed', function () {
        let directions = directionsRenderer.getDirections();
        if (directions) {
            computeTotalDistance(directions);
        }
    });
    // google.maps.event.addDomListener(window, 'load', Map);
    displayRoute(`${document.currentScript.getAttribute("start")}`, `${document.currentScript.getAttribute("end")}`, `${document.currentScript.getAttribute("stops")}`, directionsService, directionsRenderer);
  } catch (e) {
    throw e;
  }
 
}


async function displayRoute(origin, destination, stops, service, display) {
  try {
    let stopsArr = [];
    let splitStops = stops.split('/');
    for(let i = splitStops.length - 1; i >= 0; i--) {
      if(typeof splitStops[i] == "string"){
        stopsArr.push(splitStops[i]);
      }else{
        throw 'One of the stops is not a valid string'
      }
    }
    let way = [];
    for (let i = stopsArr.length - 1; i >= 0; i--) {
      way.push({location: stopsArr[i]});
    }
      let serv = await service.route({
          origin: origin,
          destination: destination,
          waypoints: way,
          travelMode: google.maps.TravelMode.DRIVING,
          avoidTolls: false,
          provideRouteAlternatives: true
      });
      display.setDirections(serv);
  } catch (e) {
      throw 'Could not display directions due to: ' + e;
  }
}

function computeTotalDistance(result) {
  let totalDist = 0;
  let totalTime = 0;
  let myroute = result.routes[0];
  if (!myroute) {
      return;
  }
  for (let i = 0; i < myroute.legs.length; i++) {
      totalDist += myroute.legs[i].distance.value;
  }
  for (let i = 0; i < myroute.legs.length; i++) {
    totalTime += myroute.legs[i].duration.value;
  }
  totalDist = (totalDist / 1000 / 1.609).toFixed(2);
  if (totalTime / 60 < 1.5) {

    totalTime = "About 1 min";

  } else if (totalTime / 60 >= 1.5 && totalTime / 3600 < 1) {

    totalTime = "About " + Math.floor(totalTime / 60) + " mins";

  } else if (totalTime / 3600 >= 1  && totalTime / 3600 < 2 && ((totalTime % 3600) / 60) < 1.5 ) {

    totalTime = "About 1 hour " + ((totalTime % 3600) / 60).toFixed(0) + " min" 

  } else if (totalTime / 3600 >= 1 && totalTime / 3600 < 2 &&  ((totalTime % 3600) / 60) >= 1.5) {

    totalTime = "About 1 hour " + Math.floor((totalTime % 3600) / 60) + " mins" 

  } else if (totalTime / 3600 >= 2 && totalTime / 86400 < 1 && (totalTime % 3600 / 60 < 1.5)) {

    totalTime = "About " + Math.floor(totalTime / 3600) + " hours " + ((totalTime % 3600) / 60).toFixed(0) + " min" 

  } else if (totalTime / 3600 >= 2 && totalTime / 86400 < 1 && ((totalTime % 3600) / 60) >= 1.5) {

    totalTime = "About " + Math.floor(totalTime / 3600) + " hours " + Math.floor((totalTime % 3600) / 60) + " mins" 

  } else if (totalTime / 86400 >= 1 && totalTime / 86400 < 2 && ((totalTime % 86400) / 3600) < 1.5) {

    totalTime = "About " + Math.floor(totalTime / 86400) + " day " + ((totalTime % 86400) / 3600).toFixed(0) + " hour"

  } else if (totalTime / 86400 >= 1 && totalTime / 86400 < 2 && ((totalTime % 86400) / 3600) >= 1.5) {

    totalTime = "About " +  Math.floor(totalTime / 86400) + " day " + Math.floor((totalTime % 86400) / 3600) + " hours"

  } else if (totalTime / 86400 >= 2 && (totalTime % 86400 / 3600 < 1.5)) {

    totalTime = "About " + Math.floor(totalTime / 86400) + " days " + (totalTime % 86400 / 3600).toFixed(0) + " hour"

  } else if (totalTime / 86400 >= 2 && (totalTime % 86400 / 3600 >= 1.5) && (totalTime % 86400 / 3600 < 24)) {

    totalTime = "About " + Math.floor(totalTime / 86400) + " days " + Math.floor(totalTime % 86400 / 3600) + " hours"
  
  }
  document.getElementById('totalDist').innerHTML = totalDist + ' miles';
  document.getElementById('totalTime').innerHTML = totalTime;
}

function errorCheck(firstName, lastName, emailAddress, password, confirmPassword) {
  firstName = firstName.trim();
  lastName = lastName.trim();
  emailAddress = emailAddress.trim();
  password = password.trim();
  confirmPassword = confirmPassword.trim();

  if (!firstName || !lastName || !emailAddress || !password || !confirmPassword) {
    throw 'Error: All fields must be supplied.';
  }

  let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  if (firstName.length == 0 || firstName.length < 2 || firstName.length > 25) {
    throw 'Error: first name must be a valid string';
  }
  for (let i = 0; i < firstName.length; i++) {
    if (nums.includes(firstName[i])) {
      throw 'Error: first name cannot include numbers';
    }
  }

  if (lastName.length == 0 || lastName.length < 2 || lastName.length > 25) {
    throw 'Error: last name must be a valid string';
  }
  for (let i = 0; i < lastName.length; i++) {
    if (nums.includes(lastName[i])) {
      throw 'Error: last name cannot include numbers';
    }
  }

  if (!emailAddress.includes('@')) {
    throw 'Error: Input valid email address';
  }
  let splitEmail = emailAddress.split('@');
  if (!splitEmail[1].includes('.')) {
    throw 'Error: Input valid email address';
  }
  //REGEX SOURCE https://stackoverflow.com/questions/10557441/regex-to-allow-atleast-one-special-character-one-uppercase-one-lowercasein-an

  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_!]).*$/;

  //figure out regex
  if (password.length == 0 || password.length < 8 || password.includes(' ')) {
    throw 'Error: must input valid password';
  }
  if (!regex.test(password)) {
    throw 'Error: Must be valid password syntax';
  }

  if (password != confirmPassword) {
    throw 'Error: Password and Confirm Password must match';
  }
  return;
}

function errorCheck2(emailAddress, password) {
  emailAddress = emailAddress.trim();
  password = password.trim();

  if (!emailAddress || !password) {
    throw 'Error: All fields must be supplied.';
  }

  if (!emailAddress.includes('@')) {
    throw 'Error: Input valid email address';
  }
  let splitEmail = emailAddress.split('@');
  if (!splitEmail[1].includes('.')) {
    throw 'Error: Input valid email address';
  }
  //REGEX SOURCE https://stackoverflow.com/questions/10557441/regex-to-allow-atleast-one-special-character-one-uppercase-one-lowercasein-an

  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_!]).*$/;

  //figure out regex
  if (password.length == 0 || password.length < 8 || password.includes(' ')) {
    throw 'Error: must input valid password';
  }
  if (!regex.test(password)) {
    throw 'Error: Must be valid password syntax';
  }

  return;
}

// for trip
// function errorCheck3(
//   tripName,
//   startLocation,
//   startDate,
//   startTime,
//   endLocation,
//   endDate,
//   endTime,
//   stops,
//   toDo,
//   usersAllowed = []
// ) {
//   // console.log(1);
//   if (
//     !tripName ||
//     !startLocation ||
//     !startDate ||
//     !startTime ||
//     !endLocation ||
//     !endDate ||
//     !endTime ||
//     !stops ||
//     !toDo
//   ) {
//     throw 'Error: All fields need to have valid values';
//   }
//   if (Number.isNaN(parseInt(tripName)) || tripName.trim().length == 0) {
//     throw 'Error: Must provide the trip name as valid nonempty string';
//   }
//   if (typeof startLocation != 'string' || startLocation.trim().length == 0) {
//     throw 'Error: Must provide the start location as valid nonempty string';
//   }
//   if (typeof startDate != 'string' || startDate.trim().length == 0) {
//     throw 'Error: Must provide start date as valid nonempty string';
//   }
//   if (typeof endLocation != 'string' || endLocation.trim().length == 0) {
//     throw 'Error: Must provide the end location as valid nonempty string';
//   }
//   // console.log(1.5);
//   //   if (!Array.isArray(toDo) || toDo.length == 0) {
//   //     throw 'Error: Must provide to-do list as valid nonempty array';
//   //   }
//   if (typeof endDate != 'string' || endDate.trim().length == 0) {
//     throw 'Error: Must provide end date as valid nonempty string';
//   }
//   if (typeof startTime != 'string' || startTime.trim().length == 0) {
//     throw 'Error: Must provide start time as valid nonempty string';
//   }
//   if (typeof endTime != 'string' || endTime.trim().length == 0) {
//     throw 'Error: Must provide end time as valid nonempty string';
//   }
//   //   if (!Array.isArray(stops)) {
//   //     throw 'You must provide an array of all stops on your trip';
//   //   }
//   // if (!Array.isArray(usersAllowed)) {
//   //   throw 'You must provide an array of all users allowed on your trip';
//   // }
//   if (startLocation == endLocation) {
//     throw 'Start location cannot be the same as end location';
//   }
//   if (startTime == endTime) {
//     throw 'Start time cannot be the same as end time';
//   }
//   if (startDate == endDate) {
//     throw 'Start date cannot be the same as end date';
//   }
//   // console.log(2);
//   tripName = tripName.trim();
//   startLocation = startLocation.trim();
//   startDate = startDate.trim();
//   endLocation = endLocation.trim();
//   endDate = endDate.trim();
//   startTime = startTime.trim();
//   endTime = endTime.trim();
//   //   stops = stops.map((stop) => stop.trim());
//   //   toDo = toDo.map((todo) => todo.trim());
//   //   if(usersAllowed.length !== 0) {
//   //     usersAllowed = usersAllowed.map((user) => user.trim());
//   //   } else {
//   //     usersAllowed = [];
//   //   }
//   let st = startTime.split(':');
//   let et = endTime.split(':');
//   if (st.length != 2 || st[0].length != 2 || st[1].length != 2) {
//     throw 'Error: Must provide start time in HH:MM format';
//   }
//   if (et.length != 2 || et[0].length != 2 || et[1].length != 2) {
//     throw 'Error: Must provide end time in HH:MM format';
//   }
//   if (st[0] * 1 < 0 || st[0] * 1 > 23) {
//     throw 'Error: Must provide start time in HH:MM format';
//   }
//   if (st[1] * 1 < 0 || st[1] * 1 > 59) {
//     throw 'Error: Must provide start time in HH:MM format';
//   }
//   if (et[0] * 1 < 0 || et[0] * 1 > 23) {
//     throw 'Error: Must provide end time in HH:MM format';
//   }
//   if (et[1] * 1 < 0 || et[1] * 1 > 59) {
//     throw 'Error: Must provide end time in HH:MM format';
//   }
//   let sd = startDate.split('/');
//   let ed = endDate.split('/');
//   let currentYear = new Date();
//   let newCurrentYear = currentYear.getFullYear();
//   if (sd[2] < currentYear && ed[2] > newCurrentYear + 2) {
//     throw 'The start date cannot be in the past and the end date cannot be more than 2 years than today';
//   }
//   if (sd.length != 3 || sd[0].length != 2 || sd[1].length != 2 || sd[2].length != 4) {
//     throw 'Error: Must provide start date in MM/DD/YYYY format';
//   }
//   if (sd[0] * 1 < 1 || sd[0] * 1 > 12) {
//     throw 'Error: Must provide start date in MM/DD/YYYY format';
//   }
//   if (sd[1] * 1 < 1 || sd[1] * 1 > 31) {
//     throw 'Error: Must provide start date in MM/DD/YYYY format';
//   }
//   if (sd[2] * 1 < 1900 || sd[2] * 1 > ed[2] * 1) {
//     throw 'Error: Must provide start date in MM/DD/YYYY format';
//   }
//   if (ed.length != 3 || ed[0].length != 2 || ed[1].length != 2 || ed[2].length != 4) {
//     throw 'Error: Must provide end date in MM/DD/YYYY format';
//   }
//   if (ed[0] * 1 < 1 || ed[0] * 1 > 12) {
//     throw 'Error: Must provide end date in MM/DD/YYYY format';
//   }
//   if (ed[1] * 1 < 1 || ed[1] * 1 > 31) {
//     throw 'Error: Must provide end date in MM/DD/YYYY format';
//   }
//   if (ed[2] * 1 < sd[2] * 1 || ed[2] * 1 > ed[2] * 1 + 1) {
//     throw 'Error: Must provide end date in MM/DD/YYYY format';
//   }
//   if (sd > ed) {
//     throw 'Error: Start date must be set to a date before end date';
//   }

//   let splitToDo = tripInfo.toDoInput.split(',');
//   let splitStops = tripInfo.stopsInput.split(',');

//   for (let i = 0; i < splitToDo.length; i++) {
//     if (typeof splitToDo[i] != 'string') {
//       throw 'One of the to-do items is not a valid string';
//     }
//   }
//   for (let i = 0; i < splitStops.length; i++) {
//     if (typeof splitStops[i] != 'string') {
//       throw 'One of the stops is not a valid string';
//     }
//   }

//   // console.log(3);
//   return;
// }

// for itinerary
function errorCheck4(activityName, date, startTime, endTime, cost, notes) {
  if (!tripName || !activityName || !date || !startTime || !endTime || !cost) {
    throw 'Error: All fields need to have valid values';
  }
  if (typeof tripName !== 'string' || tripName.trim().length === 0) {
    throw 'Error: Must provide trip id as valid nonempty string';
  }
  tripName = tripName.trim();
  if (typeof activityName !== 'string' || activityName.trim().length === 0) {
    throw 'Error: Must provide activity name as valid nonempty string';
  }
  activityName = activityName.trim();
  if (typeof date !== 'string' || date.trim().length === 0) {
    throw 'Error: Must provide date as valid nonempty string';
  }
  let splitDate = date.split('/');
  if (splitDate.length !== 3) {
    throw 'Error: Date must be in MM/DD/YYYY format';
  }
  if (splitDate[0].length !== 2 || splitDate[1].length !== 2 || splitDate[2].length !== 4) {
    throw 'Error: Date must be in MM/DD/YYYY format';
  }
  if (splitDate[0] * 1 < 1 || splitDate[0] * 1 > 12) {
    throw 'Error: Date must be in MM/DD/YYYY format';
  }
  if (splitDate[1] * 1 < 1 || splitDate[1] * 1 > 31) {
    throw 'Error: Date must be in MM/DD/YYYY format';
  }
  date = date.trim();
  if (typeof startTime !== 'string' || startTime.trim().length === 0) {
    throw 'Error: Must provide start time as valid nonempty string';
  }
  startTime = startTime.trim();
  if (typeof endTime !== 'string' || endTime.trim().length === 0) {
    throw 'Error: Must provide end time as valid nonempty string';
  }
  endTime = endTime.trim();
  if (typeof cost !== 'number') {
    throw 'Error: Must provide cost as an integer';
  }
  if (notes) {
    notes = notes.trim();
    if (typeof notes !== 'string' || notes.trim().length === 0) {
      throw 'Error: Notes must be a string';
    }
  } else {
    notes = '';
  }
  return;
}

if (registrationForm) {
  registrationForm.addEventListener('submit', (event) => {
    try {
      serverErr.innerHTML = '';
      error.hidden = true;
      error.innerHTML = '';
      let firstName = document.getElementById('firstNameInput');
      let lastName = document.getElementById('lastNameInput');
      let emailAddress = document.getElementById('emailAddressInput');
      let password = document.getElementById('passwordInput');
      let confirmPassword = document.getElementById('confirmPasswordInput');

      errorCheck(
        firstName.value,
        lastName.value,
        emailAddress.value,
        password.value,
        confirmPassword.value
      );
    } catch (e) {
      event.preventDefault();
      serverErr.innerHTML = '';
      error.hidden = false;
      error.innerHTML = e;
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    try {
      serverErr.innerHTML = '';
      error.hidden = true;
      error.innerHTML = '';

      let emailAddress = document.getElementById('emailAddressInput');
      let password = document.getElementById('passwordInput');

      errorCheck2(emailAddress.value, password.value);
    } catch (e) {
      event.preventDefault();
      serverErr.innerHTML = '';
      error.hidden = false;
      error.innerHTML = e;
    }
  });
}

if (createTrip) {
  createTrip.addEventListener('submit', (event) => {
    try {
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
      // errorCheck3(
      //   tripName.value,
      //   startLocation.value,
      //   startDate.value,
      //   startTime.value,
      //   endLocation.value,
      //   endDate.value,
      //   endTime.value,
      //   stops.value,
      //   toDo.value,
      //   usersAllowed.value
      // );
    } catch (e) {
      event.preventDefault();
      serverErr.innerHTML = '';
      error.hidden = false;
      error.innerHTML = e;
    }
  });
}

function promptQuestion() {
  if (promptQuestion1) {
    promptQuestion1.addEventListener('submit', (event) => {
      try {
        serverErr.innerHTML = '';
        error.hidden = true;
        error.innerHTML = '';
        let createItineraryQuestion = document.getElementsByClassName('createItineraryQuestion');
        for (let i = 0; i < createItineraryQuestion.length; i++) {
          createItineraryQuestion[i].hidden = false;
        }
        let selectTag = document.getElementById('createItineraryQuestion');
        selectTag.value = null;
        if (selectTag.value == 'no') {
          return;
        } else {
          createItinerary1();
        }
      } catch (e) {
        event.preventDefault();
        serverErr.innerHTML = '';
        error.hidden = false;
        error.innerHTML = e;
      }
    });
  }
}
function createItinerary1() {
  if (createItinerary) {
    createItinerary.addEventListener('submit', (event) => {
      try {
        serverErr.innerHTML = '';
        error.hidden = true;
        error.innerHTML = '';
        let createItineraryForm = document.getElementById('createItineraryForm');
        createItineraryForm.hidden = false;
        let activityName = document.getElementById('activityInput');
        let date = document.getElementById('dateInput');
        let startTime = document.getElementById('activityStartTimeInput');
        let endTime = document.getElementById('activityEndTimeInput');
        let costInput = document.getElementById('costInput');
        let notes = document.getElementById('notesInput');
        errorCheck4(
          activityName.value,
          date.value,
          startTime.value,
          endTime.value,
          costInput.value,
          notes.value
        );
        return;
      } catch (e) {
        event.preventDefault();
        serverErr.innerHTML = '';
        error.hidden = false;
        error.innerHTML = e;
      }
    });
  }
}