import * as d from '../data/index.js';
import { trips } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { getAll, get } from './trips.js';

const createActivity = async (
  tripName,
  activityName,
  date,
  startTime,
  endTime,
  cost = 0,
  notes
) => {
  if (!tripName || !activityName || !date || !startTime || !endTime) {
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
  let regexNum = /^[0-9]*$/;
  if (activityName.includes('/')) {
    throw `Error: Activity name cannot include '/'`;
  }
  if (
    splitDate[0].length !== 2 ||
    splitDate[1].length !== 2 ||
    splitDate[2].length !== 4 ||
    !regexNum.test(splitDate[0]) ||
    !regexNum.test(splitDate[1]) ||
    !regexNum.test(splitDate[2])
  ) {
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
  let st = startTime.split(':');
  let et = endTime.split(':');
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
  if (notes) {
    notes = notes.trim();
    if (typeof notes !== 'string' || notes.trim().length === 0) {
      throw 'Error: Notes must be a string';
    }
  } else {
    notes = '';
  }
  if (!regexNum.test(cost)) {
    throw 'Cost must be a number';
  }
  cost = parseInt(cost);
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
  try {
    a = await d.tripsData.get(tripName);
  } catch (e) {
    throw 'No trip with this id';
  }
  let tripStartDate = new Date(a.startDate);
  let tripEndDate = new Date(a.endDate);
  let activityDate = new Date(date);
  if (activityDate < tripStartDate || activityDate > tripEndDate) {
    throw 'Activity date is not within trip dates';
  }
  let existingItinerary = a.itinerary;
  let existingCost = 0;

  existingItinerary.push(newActivity);

  for (let i = 0; i < existingItinerary.length; i++) {
    existingCost = existingCost + existingItinerary[i].cost;
  }
  //got off slack
  existingCost = Number.parseFloat(existingCost.toFixed(2));
  let updateFields = {
    itinerary: existingItinerary,
    overallCost: existingCost
  };
  const tripCollection = await trips();

  const insertInfo = await tripCollection.findOneAndUpdate(
    { name: tripName },
    { $set: updateFields },
    { returnDocument: 'after' }
  );
  if (insertInfo.lastErrorObject.n == 0) {
    throw 'Could not add itinerary';
  }

  let newId = newActivity['_id'].toString();
  newActivity['_id'] = newId;
  return newActivity;
};

const addStop = async (tripName, stop) => {
  if (!tripName || !stop) {
    throw 'Error: All fields need to have valid values';
  }
  if (typeof tripName !== 'string' || tripName.trim().length === 0) {
    throw 'Error: Must provide trip id as valid nonempty string';
  }
  tripName = tripName.trim();

  if (typeof stop !== 'string' || stop.trim().length <= 1) {
    throw 'Error: Must provide stop as valid string';
  }
  stop = stop.trim();
  const tripCollection = await trips();
  const tripInfo = await tripCollection.findOne({ name: tripName });
  if (tripInfo === null) {
    throw `Error: No trip with that name found`;
  }
  let stops = tripInfo.stops;
  for (let y = 0; y < stops.length; y++) {
    if (stops[y] === stop) {
      throw `Error: Stop already exists`;
    }
  }
  stops.push(stop);
  const updatedTrip = await tripCollection.updateOne(
    { name: tripName },
    { $set: { stops: stops } },
    { returnDocument: 'after' }
  );
  if (updatedTrip.modifiedCount === 0) {
    throw [500, `Could not update stops of trip with name ${tripName}`];
  }
  return tripInfo;
};

const removeStop = async (tripId, stop) => {
  if (!tripId || !stop) {
    throw 'Error: All fields need to have valid values';
  }
  if (typeof tripId !== 'string' || tripId.trim().length === 0) {
    throw 'Error: Must provide trip id as valid nonempty string';
  }
  tripId = tripId.trim();
  if (!ObjectId.isValid(tripId)) {
    throw `Error: tripId provided is not a valid ObjectId`;
  }

  if (typeof stop !== 'string' || stop.trim().length === 0) {
    throw 'Error: Must provide stop as valid nonempty string';
  }
  stop = stop.trim();

  const tripCollection = await trips();
  let index = -1;
  const tripInfo = await tripCollection.findOne({ _id: new ObjectId(tripId) });
  if (tripInfo === null) {
    throw `Error: No trip with that id found`;
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
  const updatedTrip = await tripCollection.updateOne(
    { _id: new ObjectId(tripId) },
    { $set: { stops: stops } },
    { returnDocument: 'after' }
  );
  if (updatedTrip.modifiedCount === 0) {
    throw [500, `Could not remove stop in trip with id ${tripId}`];
  }
  return `Successfully removed ${stop} from the trip`;
};


const removeActivity = async (tripName, activityName) => {
  if (!activityName || !tripName) {
    throw 'Error: All fields need to have valid values';
  }
  if (
    typeof tripName !== 'string' ||
    tripName.trim().length === 0 ||
    typeof activityId !== 'string' ||
    activityId.trim().length === 0
  ) {
    throw 'Error: Must provide trip id as valid nonempty string';
  }

  tripName = tripName.trim();
  activityId = activityId.trim();
  if (!ObjectId.isValid(activityId)) {
    throw `Error: activityId provided is not a valid ObjectId`;
  }

  const tripCollection = await trips();
  let index = -1;
  const tripInfo = await tripCollection.findOne({ name: tripName });
  if (tripInfo === null) {
    throw `Error: No trip with that id found`;
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
  const updatedTrip = await tripCollection.updateOne(
    { name: tripName },
    { $set: { itinerary: newItinerary } },
    { returnDocument: 'after' }
  );
  if (updatedTrip.modifiedCount === 0) {
    throw [500, `Could not remove activity in trip with name ${tripName}`];
  }
  return `Successfully removed ${actName} from the trip`;
};

const updateActivity = async (
  tripName,
  activityId,
  activityName,
  date,
  startTime,
  endTime,
  cost,
  notes
) => {
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
  if (activityName.includes('/')) {
    throw `Error: Activity name cannot include '/'`;
  }
  let regexNum = /^[0-9]*$/;
  if (!regexNum.test(cost)) {
    throw 'Cost must be a number';
  }
  cost = parseInt(cost);
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
  const tripCollection = await trips();
  let trip = await tripCollection.findOne({ name: tripName });

  const updatedItinerary = {
    _id: new ObjectId(activityId),
    activityName: activityName,
    date: date,
    startTime: startTime,
    endTime: endTime,
    cost: cost,
    notes: notes
  };
  let itineraryArr = trip.itinerary;
  let newItineraryArr = [];

  for (let i = 0; i < itineraryArr.length; i++) {
    let currIt = itineraryArr[i];
    if (currIt._id.toString() !== activityId) {
      newItineraryArr.push(currIt);
    }
  }
  newItineraryArr.push(updatedItinerary);

  trip.itinerary = newItineraryArr;
  let newCost = 0;

  newItineraryArr.forEach((element) => {
    newCost = newCost + element.cost;
  });

  trip.overallCost = Number.parseFloat(newCost.toFixed(2));

  const updatedInfo = await tripCollection.replaceOne({ name: tripName }, trip);
  if (updatedInfo.modifiedCount === 0) {
    throw 'Could not update band successfully';
  }

  return 'You have successfully updated your itinerary';
};

const getActivitybyName = async (activityName) => {
  const tripCollection = await trips();
  const trip = await tripCollection.findOne(
    { 'itinerary.activityName': activityName },
    { projection: { _id: 0, itinerary: 1 } }
  );
  if (trip === null) {
    throw 'No trip with that activity';
  }
  let itin = trip.itinerary;
  let id = null;
  for (let i = 0; i < itin.length; i++) {
    if (itin[i].activityName === activityName) {
      id = itin[i]._id.toString();
    }
  }
  if (id === null) {
    throw 'No activity with that name found';
  }
  return id;
};

export { createActivity, addStop, removeStop, removeActivity, updateActivity, getActivitybyName };
