import {trips} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const createTrip = async (userId, 
tripName, 
startLocation,
startDate, 
startTime, 
endLocation, 
endDate, 
[stops], 
toDo, 
[usersAllowed]) => {
    if(!userId ||!tripName || !startLocation || !startDate || !startTime || !endLocation || !endDate || !stops || !itinerary || ! toDo ||usersAllowed){
        throw 'Error: All fields need to have valid values';
      }
      if(typeof tripName != 'string' || tripName.trim().length == 0){
        throw 'Error: Must provide the trip name as valid nonempty string';
      }
      if(typeof startLocation != 'string' || startLocation.trim().length == 0){
        throw 'Error: Must provide the start location as valid nonempty string';
      }
      if(typeof startDate != 'string' || startDate.trim().length == 0){
        throw 'Error: Must provide start date as valid nonempty string';
      }
      if(typeof endLocation != 'string' || endLocation.trim().length == 0){
        throw 'Error: Must provide the end location as valid nonempty string';
      }
      if(!Array.isArray(toDo) || toDo.length == 0){
        throw 'Error: Must provide to-do list as valid nonempty array';
      }
      if(typeof endDate != 'string' || endDate.trim().length == 0){
        throw 'Error: Must provide end date as valid nonempty string';
      }
      if(!Array.isArray(stops)){
        throw 'You must provide an array of all stops on your trip';
      }
      if(!Array.isArray(usersAllowed)){
        throw 'You must provide an array of all stops on your trip';
      }
      userId = userId.trim();
      tripName = tripName.trim();
      startLocation = startLocation.trim();
      startDate = startDate.trim();
      endLocation = endLocation.trim();
      endDate = endDate.trim();
      let sd = startDate.split("/");
      let ed = endDate.split("/");
      if(sd.length != 3 || sd[0].length != 2 || sd[1].length != 2 || sd[2].length != 4){
        throw 'Error: Must provide start date in MM/DD/YYYY format';
      }
      if( (sd[0]*1 == 1 || sd[0]*1 ==3 || sd[0]*1 ==5|| sd[0]*1 == 7 || sd[0]*1 ==8 || sd[0]*1 ==10 || 
        sd[0]*1 ==12) && ((sd[1]*1 <1 && sd[1]*1 >31))){
          throw 'Error: Must provide start date in  MM/DD/YYYY format';
        }
      if((sd[0]*1 == 4 || sd[0]*1 ==6 || sd[0]*1 ==5|| sd[0]*1 == 9 || sd[0]*1 ==11) && 
      ((sd[1]*1 <1 && sd[1]*1 >30))){
        throw 'Error: Must provide start date in  MM/DD/YYYY format';
      }
      if((sd[0]*1 == 2 ) && ((sd[1]*1 <1 && sd[1]*1 >29))){
        throw 'Error: Must provide start date in  MM/DD/YYYY format';
      }
      if(ed.length != 3 || ed[0].length != 2 || ed[1].length != 2 || ed[2].length != 4){
        throw 'Error: Must provide end date in MM/DD/YYYY format';
      }
      if( (ed[0]*1 == 1 || ed[0]*1 ==3 || ed[0]*1 ==5|| ed[0]*1 == 7 || ed[0]*1 ==8 || ed[0]*1 ==10 || 
        ed[0]*1 ==12) && ((ed[1]*1 <1 && ed[1]*1 >31) )){
          throw 'Error: Must provide end date in  MM/DD/YYYY format';
        }
      if((ed[0]*1 == 4 || ed[0]*1 ==6 || ed[0]*1 ==5|| ed[0]*1 == 9 || ed[0]*1 ==11) && 
      ((ed[1]*1 <1 && ed[1]*1 >30) )){
        throw 'Error: Must provide end date in  MM/DD/YYYY format';
      }
      if((ed[0]*1 == 2 ) && ((ed[1]*1 <1 && ed[1]*1 >29))){
        throw 'Error: Must provide end date in  MM/DD/YYYY format';
      }
      if(sd > ed){
        throw 'Error: Start date must be set to a date before end date';
      }
      if (stops.length === 0) throw 'You must supply at least one stop';
      for (let i in stops) {
        if (typeof stops[i] !== 'string' || stops[i].trim().length === 0) {
          throw 'You must supply at least 1 stop';
        }
        stops[i] = stops[i].trim();
      }
      if (toDo.length === 0) throw 'You must supply at least one stop';
      for (let i in toDo) {
        if (typeof toDo[i] !== 'string' || toDo[i].trim().length === 0) {
          throw 'You must supply at least 1 stop';
        }
        toDo[i] = toDo[i].trim();
      }
      let newTrip = {
        userId: userId,
        name : tripName, 
        start_location: startLocation,
        start_date: startDate, 
        start_time: startTime, 
        end_location: endLocation, 
        end_date: endDate, 
        stops: [stops], 
        itinerary: [], 
        to_do: toDo,
        cost: 0
      };
      const tripCollection = await trips();
      const insertInfo = await tripCollection.insertOne(newTrip);
      if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add trip';
      
      const newId = insertInfo.insertedId.toString();
      
      const trip = await get(newId);
      return trip;
};
const getAll = async (userId) => {
    if(!userId){
        throw 'You must provide an id to search for';
      } 
      if(typeof userId !== 'string'){
        throw 'Id must be a string';
      }
      if(userId.trim().length === 0){
        throw 'Id cannot be an empty string or just spaces';
      }
      userId = userId.trim();
    const tripCollection = await trips();
    let tripList = await tripCollection.find({}).project({_id: 1, name:1}).toArray();
    if (!tripList) throw 'Could not get all trips';
    tripList = tripList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return tripList;
};
const get = async (id) => {
    if(!id){
        throw 'You must provide an id to search for';
      } 
      if(typeof id !== 'string'){
        throw 'Id must be a string';
      }
      if(id.trim().length === 0){
        throw 'Id cannot be an empty string or just spaces';
      }
      id = id.trim();
      if(!ObjectId.isValid(id)){
        throw 'invalid object ID';
      }
      const tripCollection = await trips();
      const trip = await tripCollection.findOne({_id: new ObjectId(id)});
      if(trip === null){
        throw 'No trip with that id';
      }
      trip._id = trip._id.toString();
      return trip;
};
const filter = async (userId, sortingParam) => {
  if(!userId){
    throw 'You must provide an id to search for';
  } 
  if(typeof userId !== 'string'){
    throw 'Id must be a string';
  }
  if(userId.trim().length === 0){
    throw 'Id cannot be an empty string or just spaces';
  }

  if(!sortingParam){
    throw 'You must provide an id to search for';
  } 
  if(typeof sortingParam !== 'string'){
    throw 'Id must be a string';
  }
  if(sortingParam.trim().length === 0){
    throw 'Id cannot be an empty string or just spaces';
  }
  userId = userId.trim();
  sortingParam = sortingParam.trim();
  if(sortingParam != "past" && sortingParam != "future" && sortingParam != "present"){
    throw 'You must filter trips by either past, current, or future';
  }
    let totalTrips = getAll(userId);
    let filtered = [];
    let date = new Date();
    if(sortingParam == "past"){
      totalTrips.forEach(elem =>{
        if(totalTrips.endDate < date){
          filtered.push(elem);
        }
      });
    }
    if(sortingParam == "future"){
      totalTrips.forEach(elem =>{
        if(totalTrips.startDate > date){
          filtered.push(elem);
        }
      });
    }
    if(sortingParam == "present"){
      totalTrips.forEach(elem =>{
        if(totalTrips.startDate < date && totalTrips.endDate > date){
          filtered.push(elem);
        }
      });
    }
    return filtered;
};


const updateTime = async (tripId, startTime, endTime) => {
    if(!tripId) {
        throw "Error: TripID must be inputted"
    }
    if(!startTime) {
        throw `Error: Start time must be inputted`
    }
    if(!endTime) {
        throw `Error: End time must be inputted`
    }
    if(typeof startTime != "string") {
        throw `Error: Start time must be a string`
    }
    if(typeof endTime != "string") {
        throw 'Error: End time must be a string'
    }
    let checkStart = startTime.split(":");
    if(checkStart.length != 2 || checkStart[0].length != 2 || checkStart[1].length != 2) {
        throw `Error: Start time must be in 24 hour clock format (Ex: 01:00 or 15:23)`
    }
    if(Number(startTime.charAt(0)) < -1 || Number(startTime.charAt(0)) > 3) {
        throw `Error: First digit of hours must be 0, 1, or 2`
    }
    if(Number(startTime.charAt(1)) < -1 || Number(startTime.charAt(1)) > 9) {
        throw `Error: Second digit of hours must be a number from 0-9`
    }
    if(Number(startTime.charAt(3)) < -1 || Number(startTime.charAt(3)) > 3) {
        throw `Error: First digit of minutes must be a number from 0-5`
    }
    if(Number(startTime.charAt(4)) < -1 || Number(startTime.charAt(4)) > 9) {
        throw `Error: First digit of minutes must be a number from 0-9`
    }
    let checkEnd = endTime.split(":");
    if(checkEnd.length != 2 || checkEnd[0].length != 2 || checkEnd[1].length != 2) {
        throw `Error: Start time must be in 24 hour clock format (Ex: 01:00 or 15:23)`
    }
    if(Number(endTime.charAt(0)) < -1 || Number(endTime.charAt(0)) > 3) {
        throw `Error: First digit of hours must be 0, 1, or 2`
    }
    if(Number(endTime.charAt(1)) < -1 || Number(endTime.charAt(1)) > 9) {
        throw `Error: Second digit of hours must be a number from 0-9`
    }
    if(Number(endTime.charAt(3)) < -1 || Number(endTime.charAt(3)) > 3) {
        throw `Error: First digit of minutes must be a number from 0-5`
    }
    if(Number(endTime.charAt(4)) < -1 || Number(endTime.charAt(4)) > 9) {
        throw `Error: First digit of minutes must be a number from 0-9`
    }
    if(startTime == endTime) {
        throw `Error: Start and End times can not be the same`
    }
    if(typeof tripId != "string") {
        throw `Error: Trip Id must be a string`
    }
    if(tripId.trim().length == 0 || tripId.length == 0) {
        throw `Error: Trip Id must not be an empty string or only include empty spaces`
    }
    tripId = tripId.trim();
    const oldTrip = await get(tripId);
    if(startTime == oldTrip.startTime && endTime == oldTrip.endTime) {
        throw `Error: New start and end times cannot be the same as before`
    }
    const updatedTrip = {
        userID: oldTrip.userID,
        tripName: oldTrip.tripName,
        startLocation: oldTrip.startLocation,
        startDate: oldTrip.startDate,
        startTime: startTime,
        endLocation: oldTrip.endLocation,
        endDate: oldTrip.endDate,
        endTime: endTime,
        stops: oldTrip.stops,
        itinerary: oldTrip.itinerary,
        toDo: oldTrip.toDo,
        usersAllowed: oldTrip.usersAllowed
    };
    const tripCollection = await trips();
    const updatedTripInfo = await tripCollection.findOneAndUpdate({_id: new ObjectId(tripId)}, {$set: updatedTrip}, {returnDocument: "after"});
    if(updatedTripInfo.lastErrorObject.n == 0) {
        throw `Error: Could not update trip successfully`
    }
    updatedTripInfo.value._id = updatedTripInfo.value._id.toString();
    return updatedTripInfo.value;

}
const updateDate = async (tripId, startDate, endDate) => {
    if(!tripId) {
        throw "Error: TripID must be inputted"
    }
    if(!startDate) {
        throw `Error: Start date must be inputted`
    }
    if(!endDate) {
        throw `Error: End date must be inputted`
    }
    if(typeof startDate != "string") {
        throw `Error: Start date must be a string`
    }
    if(typeof endDate != "string") {
        throw `Error: End date must be a string`
    }
    let today = new Date();
    let year = today.getFullYear();
    let checkStart = startDate.split("/");
    if(checkStart.length != 3 || checkStart[0].length != 2 || checkStart[1].length != 2 || checkStart[2].length != 4) {
        throw `Error: Start time must be in format MM/DD/YYYY`
    }
    if(Number(checkStart[0]) < 0 || Number(checkStart[0]) > 13) {
        throw `Error: Month must be between 01-12`
    }
    if(Number(checkStart[1]) < 0 || Number(checkStart[1]) > 32) {
        throw `Error: Date must be between 1-31`
    }
    if((Number(checkStart[0]) == 4 || Number(checkStart[0]) == 6 || Number(checkStart[0]) == 9 || Number(checkStart[0]) == 11) && Number(checkStart[1]) > 30) {
        throw `Error: April, June, Septermber, and November have 30 days`
    }
    if(Number(checkStart[0]) == 2 && Number(checkStart[1]) > 30) {
        throw `Error: Feburary can only have up to 28 or 29 days`
    }
    if(Number(checkStart[3]) < 1900 || Number(year.toString()) + 1 < Number(checkStart[3])) {
        throw `Error: Trips can only be planned one year in advance`
    }
    let checkEnd = endDate.split("/");
    if(checkEnd.length != 3 || checkEnd[0].length != 2 || checkEnd[1].length != 2 || checkEnd[2].length != 4) {
        throw `Error: Start time must be in format MM/DD/YYYY`
    }
    if(Number(checkEnd[0]) < 0 || Number(checkEnd[0]) > 13) {
        throw `Error: Month must be between 01-12`
    }
    if(Number(checkEnd[1]) < 0 || Number(checkEnd[1]) > 32) {
        throw `Error: Date must be between 1-31`
    }
    if((Number(checkEnd[0]) == 4 || Number(checkEnd[0]) == 6 || Number(checkEnd[0]) == 9 || Number(checkEnd[0]) == 11) && Number(checkEnd[1]) > 30) {
        throw `Error: April, June, Septermber, and November have 30 days`
    }
    if(Number(checkEnd[0]) == 2 && Number(checkEnd[1]) > 30) {
        throw `Error: Feburary can only have up to 28 or 29 days`
    }
    if(Number(checkEnd[3]) < 1900 || Number(year.toString()) + 1 < Number(checkEnd[3])) {
        throw `Error: Trips can only be planned one year in advance`
    }
    if(typeof tripId != "string") {
        throw `Error: Trip Id must be a string`
    }
    if(tripId.trim().length == 0 || tripId.length == 0) {
        throw `Error: Trip Id must not be an empty string or only include empty spaces`
    }
    tripId = tripId.trim();
    const oldTrip = await get(tripId);
    const updatedTrip = {
        userID: oldTrip.userID,
        tripName: oldTrip.tripName,
        startLocation: oldTrip.startLocation,
        startDate: startDate,
        startTime: oldTrip.startTime,
        endLocation: oldTrip.endLocation,
        endDate: endDate,
        endTime: oldTrip.endTime,
        stops: oldTrip.stops,
        itinerary: oldTrip.itinerary,
        toDo: oldTrip.toDo,
        usersAllowed: oldTrip.usersAllowed
    };
    const tripCollection = await trips();
    const updatedTripInfo = await tripCollection.findOneAndUpdate({_id: new ObjectId(tripId)}, {$set: updatedTrip}, {returnDocument: "after"});
    if(updatedTripInfo.lastErrorObject.n == 0) {
        throw `Error: Could not update trip successfully`
    }
    updatedTripInfo.value._id = updatedTripInfo.value._id.toString();
    return updatedTripInfo.value;
}
const updateLocation = async (tripId, startLocation, endLocation) => {
    if(!tripId) {
        throw "Error: TripID must be inputted"
    }
    if(!startLocation) {
        throw `Error: Start time must be inputted`
    }
    if(!endLocation) {
        throw `Error: End time must be inputted`
    }
    if(typeof startLocation != "string") {
        throw `Error: Start Location must be a string`
    }
    if(typeof endLocation != "string") {
        throw `Error: End Location must be a string`
    }
    if(startLocation.length == 0 || startLocation.trim().length == 0) {
        throw `Error: Start location must not be an empty string or made up of empty spaces`
    }
    if(endLocation.length == 0 || endLocation.trim().length == 0) {
        throw `Error: End location must not be an empty string or made up of empty spaces`
    }
    if(typeof tripId != "string") {
        throw `Error: Trip Id must be a string`
    }
    if(tripId.trim().length == 0 || tripId.length == 0) {
        throw `Error: Trip Id must not be an empty string or only include empty spaces`
    }
    tripId = tripId.trim();
    startLocation = startLocation.trim();
    endLocation = endLocation.trim();
    const oldTrip = await get(tripId);
    const updatedTrip = {
        userID: oldTrip.userID,
        tripName: oldTrip.tripName,
        startLocation: startLocation,
        startDate: oldTrip.startDate,
        startTime: oldTrip.startTime,
        endLocation: endLocation,
        endDate: oldTrip.endDate,
        endTime: oldTrip.endTime,
        stops: oldTrip.stops,
        itinerary: oldTrip.itinerary,
        toDo: oldTrip.toDo,
        usersAllowed: oldTrip.usersAllowed
    };
    const tripCollection = await trips();
    const updatedTripInfo = await tripCollection.findOneAndUpdate({_id: new ObjectId(tripId)}, {$set: updatedTrip}, {returnDocument: "after"});
    if(updatedTripInfo.lastErrorObject.n == 0) {
        throw `Error: Could not update trip successfully`
    }
    updatedTripInfo.value._id = updatedTripInfo.value._id.toString();
    return updatedTripInfo.value;
}


export {createTrip, getAll, get, filter, updateTime, updateDate, updateLocation};