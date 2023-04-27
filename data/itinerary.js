import * as d from '../data/index.js';
import {trips} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import {getAll, get} from './trips.js';

const createActivity = async (tripId, 
    activityName,
    date,
    startTime,
    endTime, 
    cost,
    notes) => {
        if(!tripId || !activityName || !date || !startTime || !endTime || !cost){
            throw 'Error: All fields need to have valid values';
          }
          if(typeof tripId !== 'string' || tripId.trim().length === 0){
            throw 'Error: Must provide trip id as valid nonempty string';
          }
          tripId = tripId.trim();
          if(typeof activityName !== 'string' || activityName.trim().length === 0){
            throw 'Error: Must provide activity name as valid nonempty string';
          }
          activityName = activityName.trim();
          if(typeof date !== 'string' || date.trim().length === 0){
            throw 'Error: Must provide date as valid nonempty string';
          }
          date = date.trim();
          if(typeof startTime !== 'string' || startTime.trim().length === 0){
            throw 'Error: Must provide start time as valid nonempty string';
          }
          startTime = startTime.trim();
          if(typeof endTime !== 'string' || endTime.trim().length === 0){
            throw 'Error: Must provide end time as valid nonempty string';
          }
          endTime = endTime.trim();
          if(typeof cost !== 'number'){
            throw 'Error: Must provide cost as an integer';
          }
            if(notes){
              notes = notes.trim();
              if(typeof notes !== 'string' || notes.trim().length === 0){
                throw 'Error: Notes must be a string';
              }
            }else{
              notes = "";
            }
          let newActivity = {
            _id: new ObjectId(),
            activityName: activityName,
            date: date,
            startTime: startTime,
            endTime: endTime, 
            cost: cost,
            notes: notes
           };
           let a = undefined;
           try{
             a = await d.tripsData.get(tripId);
           }catch(e){
             throw "no trip with this id";
           }
           let existingItinerary = a.itinerary;
           let existingCost = 0;
         
           existingItinerary.push(newActivity);
         
           // console.log(existingAlbums)
           for(let i = 0; i < existingItinerary.length; i++){
             existingCost = existingCost + existingItinerary[i].cost;
           }
         //got off slack
           // console.log(existingRatings)
           existingCost = Number.parseFloat(existingCost.toFixed(2));
           // console.log(existingRatings)
           let updateFields = {
             itinerary: existingItinerary,
             overallCost: existingCost
           }
           const tripCollection = await trips();
         
           // let bandId2 = new ObjectId(bandId);
           const insertInfo = await tripCollection.findOneAndUpdate(
             {_id: new ObjectId(tripId)},
             {$set: updateFields},
             {returnDocument: 'after'}
           );
           if(insertInfo.lastErrorObject.n == 0){
             throw 'Could not add itinerary';
           }
             
           let newId = newActivity["_id"].toString();
           newActivity["_id"] = newId;
           return newActivity;
    };

const addStop = async (tripId, stop) => {
  if (!tripId || !stop) {
    throw 'Error: All fields need to have valid values';
  }
  if(typeof tripId !== 'string' || tripId.trim().length === 0){
    throw 'Error: Must provide trip id as valid nonempty string';
  }
  tripId = tripId.trim();
  if (!ObjectId.isValid(tripId)) {
    throw `Error: tripId provided is not a valid ObjectId`;
  }

  if(typeof stop !== 'string' || stop.trim().length === 0){
    throw 'Error: Must provide stop as valid nonempty string';
  }
  stop = stop.trim();
  //Need to figure out how what is in stops

  const tripCollection = await trips();
  const tripInfo = await tripCollection.findOne({_id: new ObjectId(tripId)});
  if (tripInfo === null) {
    throw `Error: No band with that id found`;
  }
  let stops = tripInfo.stops;
  for (let y = 0; y < stops.length; y++) {
    if (stops[y] === stop) {
      throw `Error: Stop already exists`;
    }
  }
  stops.push(stop);
  const updatedBand = await bandCollection.updateOne({_id: new ObjectId(tripId)},
  {$set: {stops: stops}},
  {returnDocument: 'after'});
  if (updatedBand.modifiedCount === 0) {
    throw [500, `Could not update stops of trip with id ${tripId}`];
  }
  return `Successfully added ${stop} to trip`;
};

const removeStop = async (tripId, stop) => {
  if (!tripId || !stop) {
    throw 'Error: All fields need to have valid values';
  }
  if(typeof tripId !== 'string' || tripId.trim().length === 0){
    throw 'Error: Must provide trip id as valid nonempty string';
  }
  tripId = tripId.trim();
  if (!ObjectId.isValid(tripId)) {
    throw `Error: tripId provided is not a valid ObjectId`;
  }

  if(typeof stop !== 'string' || stop.trim().length === 0){
    throw 'Error: Must provide stop as valid nonempty string';
  }
  stop = stop.trim();
  //Need to figure out how what is in stops

  const tripCollection = await trips();
  let index = -1;
  const tripInfo = await tripCollection.findOne({_id: new ObjectId(tripId)});
  if (tripInfo === null) {
    throw `Error: No band with that id found`;
  }
  let stops = tripInfo.stops;
  for (let y = 0; y < stops.length; y++) {
    if (stops[y] === stop) {
      index = y;
      stops.splice(index, index);
    }
  }
  if (index === -1) {
    throw `Error: Stop does not exist in trip`;
  }
  const updatedTrip = await tripCollection.updateOne({_id: new ObjectId(tripId)},
  {$set: {stops: stops}},
  {returnDocument: 'after'});
  if (updatedTrip.modifiedCount === 0) {
    throw [500, `Could not remove stop in trip with id ${tripId}`];
  }
  return `Successfully removed ${stop} from the trip`;
};

// const addToSchedule = async (tripId, itinerary) => {

// };

const removeActivity = async (tripId, activityId) => {
  if (!activityId || !tripId) {
    throw 'Error: All fields need to have valid values';
  }
  if(typeof tripId !== 'string' || tripId.trim().length === 0 || typeof activityId !== 'string' || activityId.trim().length === 0){
    throw 'Error: Must provide trip id as valid nonempty string';
  }

  tripId = tripId.trim();
  activityId = activityId.trim();
  if (!ObjectId.isValid(tripId)) {
    throw `Error: tripId provided is not a valid ObjectId`;
  }
  if (!ObjectId.isValid(activityId)) {
    throw `Error: activityId provided is not a valid ObjectId`;
  }

  const tripCollection = await trips();
  let index = -1;
  const tripInfo = await tripCollection.findOne({_id: new ObjectId(tripId)});
  if (tripInfo === null) {
    throw `Error: No band with that id found`;
  }

  let newItinerary = tripInfo.itinerary;
  let actName;
  for (let y = 0; y < newItinerary.length; y++) {
    let currObj = newItinerary[y];
    if (currObj._id.toString() === activityId) {
      index = y;
      actName = currObj.activityName;
      newItinerary.splice(index, 1);
    }
  }
  if (index === -1) {
    throw `Error: Activity does not exist in trip`;
  }
  const updatedTrip = await tripCollection.updateOne({_id: new ObjectId(tripId)},
  {$set: {itinerary: newItinerary}},
  {returnDocument: 'after'});
  if (updatedTrip.modifiedCount === 0) {
    throw [500, `Could not remove activity in trip with id ${tripId}`];
  }
  return `Successfully removed ${actName} from the trip`;
};

const updateActivity = async (tripId, activityId, activityName, date, startTime, endTime, cost, notes) => {
  if(!tripId || !activityName || !date || !startTime || !endTime || !cost){
    throw 'Error: All fields need to have valid values';
  }
  if(typeof tripId !== 'string' || tripId.trim().length === 0){
    throw 'Error: Must provide trip id as valid nonempty string';
  }
  tripId = tripId.trim();
  if(typeof activityName !== 'string' || activityName.trim().length === 0){
    throw 'Error: Must provide activity name as valid nonempty string';
  }
  activityName = activityName.trim();
  if(typeof date !== 'string' || date.trim().length === 0){
    throw 'Error: Must provide date as valid nonempty string';
  }
  date = date.trim();
  if(typeof startTime !== 'string' || startTime.trim().length === 0){
    throw 'Error: Must provide start time as valid nonempty string';
  }
  startTime = startTime.trim();
  if(typeof endTime !== 'string' || endTime.trim().length === 0){
    throw 'Error: Must provide end time as valid nonempty string';
  }
  endTime = endTime.trim();
  if(typeof cost !== 'number'){
    throw 'Error: Must provide cost as an integer';
  }
    if(notes){
      notes = notes.trim();
      if(typeof notes !== 'string' || notes.trim().length === 0){
        throw 'Error: Notes must be a string';
      }
    }else{
      notes = "";
    }
    const tripCollection = await trips();
  // Find the band given the band id
  let trip = await tripCollection.findOne({ _id: new ObjectId(tripId) });

  // Update the band with the given id
  const updatedItinerary = {
    _id: new ObjectId(activityId),
    activityName: activityName,
    date: date,
    startTime: startTime,
    endTime: endTime, 
    cost: cost,
    notes: notes
  }

  let itineraryArr = trip.itinerary;
  let newItineraryArr = [];
  // itineraryArr.push(updatedItinerary);
  // trip.itinerary = itineraryArr;

  // console.log(itineraryArr);

  // console.log(newItineraryArr);

  for(let i = 0; i < itineraryArr.length; i++) {
    let currIt = itineraryArr[i];
    // console.log(currIt)
    // console.log(currIt._id.toString())
    // console.log(activityId);
    if (currIt._id.toString() !== activityId) {
      newItineraryArr.push(currIt);
    }
  }

  // console.log(newItineraryArr);
  // console.log(itineraryArr);

  newItineraryArr.push(updatedItinerary);

  // console.log(newItineraryArr);

  trip.itinerary = newItineraryArr;

  // console.log(itineraryArr);

  // let itineraryArr = trip.itinerary;
  // console.log(itineraryArr);

  let newCost = 0;

  newItineraryArr.forEach((element) => {
    newCost = newCost+element.cost;
  });

  trip.overallCost = Number.parseFloat(newCost.toFixed(2));

  const updatedInfo = await tripCollection.replaceOne({ _id: new ObjectId(tripId) }, trip);



  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update band successfully";
  }

  return await get(tripId);
};

export {createActivity, addStop, removeStop, removeActivity, updateActivity};