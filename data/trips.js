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
      if(typeof toDo != 'string' || toDo.trim().length == 0){
        throw 'Error: Must provide to-do list as valid nonempty string';
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
      let sd = startDate.split("-");
      let ed = startDate.split("-");
      if(sd.length != 3 || sd[0].length != 2 || sd[1].length != 2 || sd[2].length != 4){
        throw 'Error: Must provide start date in MM-DD-YYYY format';
      }
      if( (sd[0]*1 == 1 || sd[0]*1 ==3 || sd[0]*1 ==5|| sd[0]*1 == 7 || sd[0]*1 ==8 || sd[0]*1 ==10 || 
        sd[0]*1 ==12) && ((sd[1]*1 <1 && sd[1]*1 >31))){
          throw 'Error: Must provide start date in  MM-DD-YYYY format';
        }
      if((sd[0]*1 == 4 || sd[0]*1 ==6 || sd[0]*1 ==5|| sd[0]*1 == 9 || sd[0]*1 ==11) && 
      ((sd[1]*1 <1 && sd[1]*1 >30))){
        throw 'Error: Must provide start date in  MM-DD-YYYY format';
      }
      if((sd[0]*1 == 2 ) && ((sd[1]*1 <1 && sd[1]*1 >29))){
        throw 'Error: Must provide start date in  MM-DD-YYYY format';
      }
      if(ed.length != 3 || ed[0].length != 2 || ed[1].length != 2 || ed[2].length != 4){
        throw 'Error: Must provide end date in MM-DD-YYYY format';
      }
      if( (ed[0]*1 == 1 || ed[0]*1 ==3 || ed[0]*1 ==5|| ed[0]*1 == 7 || ed[0]*1 ==8 || ed[0]*1 ==10 || 
        ed[0]*1 ==12) && ((ed[1]*1 <1 && ed[1]*1 >31) )){
          throw 'Error: Must provide end date in  MM-DD-YYYY format';
        }
      if((ed[0]*1 == 4 || ed[0]*1 ==6 || ed[0]*1 ==5|| ed[0]*1 == 9 || ed[0]*1 ==11) && 
      ((ed[1]*1 <1 && ed[1]*1 >30) )){
        throw 'Error: Must provide end date in  MM-DD-YYYY format';
      }
      if((ed[0]*1 == 2 ) && ((ed[1]*1 <1 && ed[1]*1 >29))){
        throw 'Error: Must provide end date in  MM-DD-YYYY format';
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
const createList = async (tripId, listName, [tasks]) => {
  //i did this and then redid it and had no clue how this was supposed to be structured since it isn't supposed
  //to be an object??
}
export {createTrip, getAll, get, filter, createList};