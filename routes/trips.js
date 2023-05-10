import e, { Router } from 'express';
const router = Router();
import { tripsData } from '../data/index.js';
import { itineraryData } from '../data/index.js';
import validation from '../validation.js';
import xss from "xss";
import { get } from '../data/trips.js';
import { checkUserAllowed } from '../helpers.js';

router.route('/').get(async (req, res) => {
  try {
    let tData = await tripsData.getAll(req.session.user.id);
    return res.render('tripplanning', { userId: req.session.user.id, trips: tData });
  } catch (e) {
    return res.status(500).json(e);
  }
});


router
  .route('/trip/:tripName')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.tripName = validation.checkString(req.params.tripName);
      const trip = await tripsData.get(req.params.tripName);
      return res.render('edittrip', { trips: trip, currentTrips: req.params.tripName });
    } catch (e) {
      if (e == 'The id provided is not a valid ObjectId') {
        return res.status(400).json(e);
      }
      if (e == 'No trip with that id') {
        return res.status(404).json(e);
      }
    }
  })
  .post(async (req, res) => {
    console.log('hi');
  })
  .put(async (req, res) => {
    //code here for PUT
    let tripInfo = req.body;
    let tripNameInput = xss(tripInfo.tripNameInput);
    let startLocationInput = xss(tripInfo.startLocationInput);
    let endLocationInput = xss(tripInfo.endLocationInput);
    let startDateInput = xss(tripInfo.startDateInput);
    let endDateInput = xss(tripInfo.endDateInput);
    let startTimeInput = xss(tripInfo.startTimeInput);
    let endTimeInput = xss(tripInfo.endTimeInput);
    let stopsInput = xss(tripInfo.stopsInput);
    let toDoInput = xss(tripInfo.toDoInput);

    let toDoArr = [];
    let stopsArr = [];
    let usersArr = [];
    let regex = /.*[a-zA-Z].*/;
    let regexStringsOnly = /^[A-Za-z]+$/;

    try {
      if (!regex.test(tripNameInput)) {
        throw 'Trip Name must be a string';
      }

      let splitToDo = toDoInput.split(',');
      let splitStops = stopsInput.split('/');
      let splitUsers = tripInfo.allowedInput.split(',');

      for (let i = 0; i < splitToDo.length; i++) {
        if (typeof splitToDo[i] == 'string') {
          toDoArr.push(splitToDo[i]);
        } else {
          throw 'One of the to-do items is not a valid string';
        }
      }
      for (let i = 0; i < splitStops.length; i++) {
        if (typeof splitStops[i] == 'string') {
          stopsArr.push(splitStops[i]);
        } else {
          throw 'One of the stops is not a valid string';
        }
      }
      for (let i = 0; i < splitUsers.length; i++) {
        if (typeof splitUsers[i] === 'string') {
          usersArr.push(splitUsers[i].trim());
        } else {
          throw 'One of the users_allowed items is not a valid string';
        }
      }
    } catch (e) {
      return res.status(400).json(`${e}`);
    }

    try {
      req.params.tripName = validation.checkString(req.params.tripName);
      let trippers = await get(req.params.tripName); 
      const updatedTrip = await tripsData.update(
        trippers.userId,
        req.params.tripName,
        req.body.tripNameInput,
        req.body.startLocationInput,
        req.body.startDateInput,
        req.body.startTimeInput,
        req.body.endLocationInput,
        req.body.endDateInput,
        req.body.endTimeInput,
        stopsArr,
        toDoArr,
        usersArr
      );
      return res.render('success', { success: 'You have successfully updated your trip!' });
    } catch (e) {
      return res.status(400).render("edittrip", {error: e, currentTrips: req.session.currentTrips});
    }
  });

router.route('/itinerary/:tripName').post(async (req, res) => {
  let actInfo = req.body;
  let activityInput = xss(actInfo.activityInput);
  let dateInput = xss(actInfo.dateInput);
  let activityStartTimeInput = xss(actInfo.activityStartTimeInput);
  let activityEndTimeInput = xss(actInfo.activityEndTimeInput);
  let costInput = xss(actInfo.costInput);
  let notesInput = xss(actInfo.notesInput);
  let regex = /.*[a-zA-Z].*/;
  let regexNum = /^[0-9]*$/;
  let st = activityStartTimeInput.split(':');
  let et = activityEndTimeInput.split(':');
  let sd = dateInput.split('/');

  try{
    let querying5 = await tripsData.get(req.params.tripName)
  }catch(e){
    return res.status(400).render("itinerary", {error: e})
  }

  try {
    if (!regex.test(activityInput)) {
      throw 'Activity Name must be a string';
    }

    if (
      st.length != 2 ||
      st[0].length != 2 ||
      st[1].length != 2 ||
      !regexNum.test(st[0]) ||
      !regexNum.test(st[1])
    ) {
      throw 'Error: Must provide start time in HH:MM format';
    }
    if (
      et.length != 2 ||
      et[0].length != 2 ||
      et[1].length != 2 ||
      !regexNum.test(et[0]) ||
      !regexNum.test(et[1])
    ) {
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
    let currentYear = new Date();
    let newCurrentYear = currentYear.getFullYear();
    if (
      sd[2] < newCurrentYear
    ) {
      throw 'The start date cannot be in the past and the end date cannot be more than 2 years than today';
    }
    if (
      sd.length != 3 ||
      sd[0].length != 2 ||
      sd[1].length != 2 ||
      sd[2].length != 4 ||
      !regexNum.test(sd[0]) ||
      !regexNum.test(sd[1]) ||
      !regexNum.test(sd[2])
    ) {
      throw 'Error: Must provide start date in MM/DD/YYYY format';
    }
    if (sd[0] * 1 < 1 || sd[0] * 1 > 12) {
      throw 'Error: Must provide start date in MM/DD/YYYY format';
    }
    if (sd[1] * 1 < 1 || sd[1] * 1 > 31) {
      throw 'Error: Must provide start date in MM/DD/YYYY format';
    }
    if (
      sd[2] * 1 <
      1900
    ) {
      throw 'Error: Must provide start date in MM/DD/YYYY format';
    }
  } catch (e) {
    return res.status(400).json(`${e}`);
  }

  try {
    const itinerary = await itineraryData.createActivity(
      req.params.tripName,
      req.body.activityInput,
      req.body.dateInput,
      req.body.activityStartTimeInput,
      req.body.activityEndTimeInput,
      req.body.costInput,
      req.body.notesInput
    );
    return res.render('successitinerary', { success: 'You have successfully added an activity!' });
  } catch (e) {
    return res.status(400).render("createItinerary", {error: e});
  }
});

router
  .route('/itinerary/:tripName/:itineraryId')
  .delete(async (req, res) => {
    try {
      req.params.tripName = validation.checkString(req.params.tripName);
      req.params.itineraryId = validation.checkId(req.params.itineraryId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      let deletedTrip = await itineraryData.removeActivity(
        req.params.tripName,
        req.params.itineraryId
      );
      return res.json(deletedTrip);
    } catch (e) {
      return res.status(500).send({ error: e });
    }
  })
  .put(async (req, res) => {
    try {
      req.params.tripName = validation.checkString(req.params.tripName);
      req.params.itineraryId = validation.checkId(req.params.itineraryId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      let updatedTrip = await itineraryData.updateActivity(
        req.params.tripName,
        req.params.itineraryId,
        req.body.activityName,
        req.body.date,
        req.body.startTime,
        req.body.endTime,
        req.body.cost,
        req.body.notes
      );
      return res.render('successitinerary', {
        success: 'You have successfully updated your activity!'
      });
    } catch (e) {
      return res.status(500).send({ error: `${e}` });
    }
  });

router
  .route('/itinerary')
  .get(async (req, res) => {
    //code here for GET
    let tData2 = await tripsData.getAll(req.session.user.id);
    return res.render('itinerary', { title: 'choose trip', trips: tData2 });
  })
  .post(async (req, res) => {
    req.session.currentTrip = req.body.tripName;
    try{
      let querying5 = await tripsData.get(req.body.tripName)
    }catch(e){
     return res.status(400).render("itinerary", {error: e})
    }
    return res.render('createItinerary', {
      title: 'itinerary for ' + req.body.tripName,
      currentTrip: req.session.currentTrip
    });
  });

router
  .route('/edititinerary')
  .get(async (req, res) => {
    //code here for GET
    let tData4 = await tripsData.getAll(req.session.user.id);
    let tData5 = await tripsData.getTripsAllowed(req.session.user.id);
    let tData6 = tData4.concat(tData5);
    
    return res.render('choosetrip', { title: 'edit itinerary', trips: tData6 });
  })
  .post(async (req, res) => {
    
    return res.redirect(`/trips/edititinerary/${req.body.tripName}/`);
  });

router
  .route('/edititinerary/:tripName')
  .get(async (req, res) => {
    //code here for GET
    let tData4 = await tripsData.getAll(req.session.user.id);
    let tData5 = await tripsData.getTripsAllowed(req.session.user.id);
    let tData6 = tData4.concat(tData5);
    let itData;
    for(let i = 0; i<tData6.length; i++) {
      if(tData6[i].name == req.params.tripName) {
        itData = tData6[i]
        break;
      }
    }
    try{
      if(!itData) {
        throw "activity with given name DNE"
      }
    }catch(e){
      return res.status(400).render("chooseitinerary", {error: e})
    }


    return res.render('chooseitinerary', {
      title: 'edit itinerary for trip: ' + req.params.tripName,
      trips: itData.itinerary,
      currentTrip: req.params.tripName
    });
  })
  .post(async (req, res) => {
    try{
      let querying = await itineraryData.getActivitybyName(req.body.activityName);
    }catch(e){
      return res.status(400).render("chooseitinerary", {error: e});
    }
    
    return res.redirect(`/trips/edititinerary/${req.params.tripName}/${req.body.activityName}`);
  });

router
  .route('/edititinerary/:tripName/:itineraryName')
  .get(async (req, res) => {
    //code here for GET
    
    try {
      let test = await itineraryData.getActivitybyName(req.params.itineraryName);
    } catch (e) {
      return res.status(400).render("chooseitinerary", {error: e});
    }

    return res.render('edititinerary', {
      title: 'edit itinerary for trip: ' + req.params.tripName,
      currentTrip: req.params.tripName,
      currentIt: req.params.itineraryName
    });
  })
  .post(async (req, res) => {
    console.log('hola');
  })
  .put(async (req, res) => {
    let actInfo = req.body;
    let activityInput = xss(actInfo.activityInput);
    let dateInput = xss(actInfo.dateInput);
    let activityStartTimeInput = xss(actInfo.activityStartTimeInput);
    let activityEndTimeInput = xss(actInfo.activityEndTimeInput);
    let costInput = xss(actInfo.costInput);
    let notesInput = xss(actInfo.notesInput);

    let regex = /.*[a-zA-Z].*/;
    let regexNum = /^[0-9]*$/;
    let st = activityStartTimeInput.split(':');
    let et = actInfo.activityEndTimeInput.split(':');
    let sd = dateInput.split('/');

    try {
      if (!regex.test(activityInput)) {
        throw 'Activity Name must be a string';
      }

      if (
        st.length != 2 ||
        st[0].length != 2 ||
        st[1].length != 2 ||
        !regexNum.test(st[0]) ||
        !regexNum.test(st[1])
      ) {
        throw 'Error: Must provide start time in HH:MM format';
      }
      if (
        et.length != 2 ||
        et[0].length != 2 ||
        et[1].length != 2 ||
        !regexNum.test(et[0]) ||
        !regexNum.test(et[1])
      ) {
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
      let currentYear = new Date();
      let newCurrentYear = currentYear.getFullYear();
      if (
        sd[2] < newCurrentYear
      ) {
        throw 'The start date cannot be in the past and the end date cannot be more than 2 years than today';
      }
      if (
        sd.length != 3 ||
        sd[0].length != 2 ||
        sd[1].length != 2 ||
        sd[2].length != 4 ||
        !regexNum.test(sd[0]) ||
        !regexNum.test(sd[1]) ||
        !regexNum.test(sd[2])
      ) {
        throw 'Error: Must provide start date in MM/DD/YYYY format';
      }
      if (sd[0] * 1 < 1 || sd[0] * 1 > 12) {
        throw 'Error: Must provide start date in MM/DD/YYYY format';
      }
      if (sd[1] * 1 < 1 || sd[1] * 1 > 31) {
        throw 'Error: Must provide start date in MM/DD/YYYY format';
      }
      if (
        sd[2] * 1 <
        1900
      ) {
        throw 'Error: Must provide start date in MM/DD/YYYY format';
      }
    } catch (e) {
      return res.status(400).json(`${e}`);
    }

    try {
      let activityid = await itineraryData.getActivitybyName(req.params.itineraryName);
      const updatedActivity = await itineraryData.updateActivity(
        req.params.tripName,
        activityid,
        req.body.activityInput,
        req.body.dateInput,
        req.body.activityStartTimeInput,
        req.body.activityEndTimeInput,
        req.body.costInput,
        req.body.notesInput
      );

      return res.render('successitinerary', {
        success: 'You have successfully updated your activity!'
      });
    } catch (e) {
      return res.status(400).render("edititinerary", {error: e});
    }
  });

router
  .route('/edittrip')
  .get(async (req, res) => {
    //code here for GET
    try {
      let tData3 = await tripsData.getAll(req.session.user.id); 
      let tData4 = await tripsData.getTripsAllowed(req.session.user.id);
      let tData5 = tData3.concat(tData4);
      return res.render('updateTrip', { title: 'edit trip', trips: tData5 });
    } catch (e) {
      return res.status(400).render("edittrip", {error: e});
    }
   
  })
  .post(async (req, res) => {
    req.session.currentTrips = req.body.tripName;
    try{
      let querying3= await tripsData.get(req.body.tripName)
    }catch(e){
      let tData3 = await tripsData.getAll(req.session.user.id);
      return res.status(400).render("updateTrip", {error: e, trips: tData3})
    }

    return res.render('edittrip', {
      title: 'edit trip: ' + req.body.tripName,
      currentTrips: req.session.currentTrips
    });
  });

router.route('/edititinerary').get(async (req, res) => {
  //code here for GET
  return res.render('edititinerary', { title: 'edit itinerary' });
});

router.route('/map/:userId/:tripName').get(checkUserAllowed, async (req, res) => {
  //code here for GET
  try {
    req.session.currentTrip = req.params.tripName;
    let trip = await tripsData.get(req.params.tripName);
    let slash = '';
    if (trip.stops.length === 0) {
    } else {
      for (let i = 0; i < trip.stops.length; i++) {
        slash = slash + trip.stops[i] + '/';
      }
      slash = slash.substring(0, slash.length - 1);
    }
    return res.render('map', {
      title: `${req.params.tripName} map`,
      userId: req.session.user.id,
      currentName: req.session.currentTrip,
      mData: trip,
      stops: slash
    });
  } catch (e) {
    return res.status(500).json(e);
  }
});

router
  .route('/map')
  .post(async (req, res) => {
    //code here for POST
    let tripInfo = req.body;
    let tripNameInput = xss(tripInfo.tripNameInput);
    let startLocationInput = xss(tripInfo.startLocationInput);
    let endLocationInput = xss(tripInfo.endLocationInput);
    let startDateInput = xss(tripInfo.startDateInput);
    let endDateInput = xss(tripInfo.endDateInput);
    let startTimeInput = xss(tripInfo.startTimeInput);
    let endTimeInput = xss(tripInfo.endTimeInput);
    let stopsInput = xss(tripInfo.stopsInput);
    let toDoInput = xss(tripInfo.toDoInput);

    let toDoArr = [];
    let stopsArr = [];
    let usersArr = [];
    let regex = /.*[a-zA-Z].*/;
    let regexStringsOnly = /^[A-Za-z]+$/;

    try {
      if (!regex.test(tripNameInput)) {
        throw 'Trip Name must be a string';
      }

      let splitToDo = toDoInput.split(',');
      let splitStops = stopsInput.split('/');
      let splitUsers = tripInfo.allowedInput.split(',');

      for (let i = 0; i < splitToDo.length; i++) {
        if (typeof splitToDo[i] == 'string') {
          toDoArr.push(splitToDo[i]);
        } else {
          throw 'One of the to-do items is not a valid string';
        }
      }
      for (let i = 0; i < splitStops.length; i++) {
        if (typeof splitStops[i] == 'string') {
          stopsArr.push(splitStops[i]);
        } else {
          throw 'One of the stops is not a valid string';
        }
      }
      for (let i = 0; i < splitUsers.length; i++) {
        if (typeof splitUsers[i] === 'string') {
          usersArr.push(splitUsers[i].trim());
        } else {
          throw 'One of the users_allowed items is not a valid string';
        }
      }
    } catch (e) {
      return res.status(400).json(`${e}`);
    }

    try {
      const trip = await tripsData.createTrip(
        req.session.user.id,
        req.body.tripNameInput,
        req.body.startLocationInput,
        req.body.startDateInput,
        req.body.startTimeInput,
        req.body.endLocationInput,
        req.body.endDateInput,
        req.body.endTimeInput,
        stopsArr,
        toDoArr,
        usersArr
      );
      req.session.currentTrip = req.body.tripNameInput;
      let slash = '';
      if (trip.stops.length === 0) {
      } else {
        for (let i = 0; i < trip.stops.length; i++) {
          slash = slash + trip.stops[i] + '/';
        }
        slash = slash.substring(0, slash.length - 1);
      }
      return res
        .status(200)
        .redirect(`/trips/map/${req.session.user.id}/${req.session.currentTrip}`);
    } catch (e) {
      return res.status(400).render("tripplanning", {error: e});
    }
  })
  .put(async (req, res) => {
    try {
      const trip = await itineraryData.addStop(req.session.currentTrip, req.body.newStopInput);
      let slash = '';
      if (trip.stops.length === 0) {
      } else {
        for (let i = 0; i < trip.stops.length; i++) {
          slash = slash + trip.stops[i] + '/';
        }
        slash = slash.substring(0, slash.length - 1);
      }
      return res
        .status(200)
        .redirect(`/trips/map/${req.session.user.id}/${req.session.currentTrip}`);
    } catch (e) {
      return res.status(400).json(e);
    }
  });

export default router;
