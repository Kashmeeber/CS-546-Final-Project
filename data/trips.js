import { trips, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

// ADD: check that trip is at most one year in advance
// API call??
const createTrip = async (
  userId,
  tripName,
  startLocation,
  startDate,
  startTime,
  endLocation,
  endDate,
  endTime,
  stops,
  toDo,
  usersAllowed
) => {
  if (
    !userId ||
    !tripName ||
    !startLocation ||
    !startDate ||
    !startTime ||
    !endLocation ||
    !endDate ||
    !endTime ||
    !stops ||
    !toDo ||
    !usersAllowed
  ) {
    throw 'Error: All fields need to have valid values';
  }
  if (typeof tripName != 'string' || tripName.trim().length == 0) {
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
  if (!Array.isArray(toDo) || toDo.length == 0) {
    throw 'Error: Must provide to-do list as valid nonempty array';
  }
  if (typeof endDate != 'string' || endDate.trim().length == 0) {
    throw 'Error: Must provide end date as valid nonempty string';
  }
  if (typeof startTime != 'string' || startTime.trim().length == 0) {
    throw 'Error: Must provide start time as valid nonempty string';
  }
  if (typeof endTime != 'string' || endTime.trim().length == 0) {
    throw 'Error: Must provide end time as valid nonempty string';
  }
  if (!Array.isArray(stops)) {
    throw 'You must provide an array of all stops on your trip';
  }
  if (!Array.isArray(usersAllowed)) {
    throw 'You must provide an array of all users allowed on your trip';
  }
  userId = userId.trim();
  tripName = tripName.trim();
  startLocation = startLocation.trim();
  startDate = startDate.trim();
  endLocation = endLocation.trim();
  endDate = endDate.trim();
  startTime = startTime.trim();
  endTime = endTime.trim();
  // trim stops, todo and usersAllowed
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
    throw "The start date cannot be in the past and the end date cannot be more than 2 years from today";
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
  if (stops.length === 0) throw 'You must supply at least one stop';
  for (let i in stops) {
    if (typeof stops[i] !== 'string' || stops[i].trim().length === 0) {
      throw 'You must supply at least 1 stop';
    }
    stops[i] = stops[i].trim();
  }
  if (toDo.length === 0) throw 'You must supply at least one to-do item';
  for (let i in toDo) {
    if (typeof toDo[i] !== 'string' || toDo[i].trim().length === 0) {
      throw 'You must supply at least 1 to-do item';
    }
    toDo[i] = toDo[i].trim();
  }
  let newTrip = {
    userId: userId,
    name: tripName,
    start_location: startLocation,
    start_date: startDate,
    start_time: startTime,
    end_location: endLocation,
    end_date: endDate,
    end_time: endTime,
    stops: stops,
    itinerary: [],
    to_do: toDo,
    cost: 0,
    users_allowed: usersAllowed
  };
  const tripCollection = await trips();
  const insertInfo = await tripCollection.insertOne(newTrip);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add trip';
  const newId = insertInfo.insertedId.toString();
  const trip = await get(newId);
  return trip;
};

const getAll = async (userId) => {
  if (!userId) {
    throw 'You must provide an id to search for';
  }
  if (typeof userId !== 'string') {
    throw 'Id must be a string';
  }
  if (userId.trim().length === 0) {
    throw 'Id cannot be an empty string or just spaces';
  }
  userId = userId.trim();
  const tripCollection = await trips();
  const tripList = await tripCollection.find({ userId: userId }).toArray();
  if (!tripList) throw 'Could not get all trips';
  return tripList;
};

const get = async (id) => {
  if (!id) {
    throw 'You must provide an id to search for';
  }
  if (typeof id !== 'string') {
    throw 'Id must be a string';
  }
  if (id.trim().length === 0) {
    throw 'Id cannot be an empty string or just spaces';
  }
  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw 'invalid object ID';
  }
  const tripCollection = await trips();
  const trip = await tripCollection.findOne({ _id: new ObjectId(id) });
  if (trip === null) {
    throw 'No trip with that id';
  }
  trip._id = trip._id.toString();
  return trip;
};

// TODO: filter function -- MARIAM
const filter = async (userId, sortingParam) => {
  if (!userId) {
    throw 'You must provide an id to search for';
  }
  if (typeof userId !== 'string') {
    throw 'Id must be a string';
  }
  if (userId.trim().length === 0) {
    throw 'Id cannot be an empty string or just spaces';
  }
  if (!sortingParam) {
    throw 'You must provide an id to search for';
  }
  if (typeof sortingParam !== 'string') {
    throw 'Id must be a string';
  }
  if (sortingParam.trim().length === 0) {
    throw 'Id cannot be an empty string or just spaces';
  }
  userId = userId.trim();
  sortingParam = sortingParam.trim();
  if (sortingParam != 'past' && sortingParam != 'future' && sortingParam != 'present') {
    throw 'You must filter trips by either past, present, or future';
  }
  let allTripArray = [];
  let allTrips = await getAll(userId);
  allTrips.forEach((elem) => {
    elem._id = elem._id.toString();
    allTripArray.push(elem);
  });
  let filtered = [];
  let date = new Date();
  // if (sortingParam == 'past') {
  //   totalTrips.forEach((elem) => {
  //     if (totalTrips.endDate < date) {
  //       filtered.push(elem);
  //     }
  //   });
  // }
  // if (sortingParam == 'future') {
  //   totalTrips.forEach((elem) => {
  //     if (totalTrips.startDate > date) {
  //       filtered.push(elem);
  //     }
  //   });
  // }
  // if (sortingParam == 'present') {
  //   totalTrips.forEach((elem) => {
  //     if (totalTrips.startDate < date && totalTrips.endDate > date) {
  //       filtered.push(elem);
  //     }
  //   });
  // }
  return filtered;
};

// TODO: updateTime -- SHAILAJA
// NOTE: some object types in the database, when returned, are null
// new start and end times are the same as before --> should error, doesn't
// TEST CASES:
// updateTime(tripId, '00:00', '12:59'); --> fails but shouldn't
// FIX: object names
const updateTime = async (tripId, startTime, endTime) => {
  if (!tripId) {
    throw 'Error: TripID must be inputted';
  }
  if (!startTime) {
    throw `Error: Start time must be inputted`;
  }
  if (!endTime) {
    throw `Error: End time must be inputted`;
  }
  if (typeof startTime != 'string') {
    throw `Error: Start time must be a string`;
  }
  if (typeof endTime != 'string') {
    throw 'Error: End time must be a string';
  }
  // let st = startTime.split(':');
  // let et = endTime.split(':');
  // if (st.length != 2 || st[0].length != 2 || st[1].length != 2) {
  //   throw 'Error: Must provide start time in HH:MM format';
  // }
  // if (et.length != 2 || et[0].length != 2 || et[1].length != 2) {
  //   throw 'Error: Must provide end time in HH:MM format';
  // }
  // if (st[0] * 1 < 0 || st[0] * 1 > 23) {
  //   throw 'Error: Must provide start time in HH:MM format';
  // }
  // if (st[1] * 1 < 0 || st[1] * 1 > 59) {
  //   throw 'Error: Must provide start time in HH:MM format';
  // }
  // if (et[0] * 1 < 0 || et[0] * 1 > 23) {
  //   throw 'Error: Must provide end time in HH:MM format';
  // }
  // if (et[1] * 1 < 0 || et[1] * 1 > 59) {
  //   throw 'Error: Must provide end time in HH:MM format';
  // }
  let checkStart = startTime.split(':');
  if (checkStart.length != 2 || checkStart[0].length != 2 || checkStart[1].length != 2) {
    throw `Error: Start time must be in 24 hour clock format (Ex: 01:00 or 15:23)`;
  }
  if (Number(startTime.charAt(0)) < -1 || Number(startTime.charAt(0)) > 3) {
    throw `Error: First digit of hours must be 0, 1, or 2`;
  }
  if (Number(startTime.charAt(1)) < -1 || Number(startTime.charAt(1)) > 9) {
    throw `Error: Second digit of hours must be a number from 0-9`;
  }
  if (Number(startTime.charAt(3)) < -1 || Number(startTime.charAt(3)) > 3) {
    throw `Error: First digit of minutes must be a number from 0-5`;
  }
  if (Number(startTime.charAt(4)) < -1 || Number(startTime.charAt(4)) > 9) {
    throw `Error: First digit of minutes must be a number from 0-9`;
  }
  let checkEnd = endTime.split(':');
  if (checkEnd.length != 2 || checkEnd[0].length != 2 || checkEnd[1].length != 2) {
    throw `Error: End time must be in 24 hour clock format (Ex: 01:00 or 15:23)`;
  }
  if (Number(endTime.charAt(0)) < -1 || Number(endTime.charAt(0)) >= 3) {
    throw `Error: First digit of hours must be 0, 1, or 2`;
  }
  if (Number(endTime.charAt(1)) < -1 || Number(endTime.charAt(1)) > 9) {
    throw `Error: Second digit of hours must be a number from 0-9`;
  }
  if (Number(endTime.charAt(3)) < -1 || Number(endTime.charAt(3)) > 3) {
    throw `Error: First digit of minutes must be a number from 0-5`;
  }
  if (Number(endTime.charAt(4)) < -1 || Number(endTime.charAt(4)) > 9) {
    throw `Error: First digit of minutes must be a number from 0-9`;
  }
  if (startTime == endTime) {
    throw `Error: Start and End times can not be the same`;
  }
  if (typeof tripId != 'string') {
    throw `Error: Trip Id must be a string`;
  }
  if (tripId.trim().length == 0 || tripId.length == 0) {
    throw `Error: Trip Id must not be an empty string or only include empty spaces`;
  }
  tripId = tripId.trim();
  const oldTrip = await get(tripId);
  if (startTime == oldTrip.startTime && endTime == oldTrip.endTime) {
    throw `Error: New start and end times cannot be the same as before`;
  }
  const updatedTrip = {
    userId: oldTrip.userId,
    name: oldTrip.name,
    start_location: oldTrip.start_location,
    start_date: oldTrip.start_date,
    start_time: startTime,
    end_location: oldTrip.end_location,
    end_date: oldTrip.end_date,
    end_time: endTime,
    stops: oldTrip.stops,
    itinerary: oldTrip.itinerary,
    toDo: oldTrip.toDo,
    cost: oldTrip.cost,
    users_allowed: oldTrip.users_allowed
  };
  const tripCollection = await trips();
  const updatedTripInfo = await tripCollection.findOneAndUpdate(
    { _id: new ObjectId(tripId) },
    { $set: updatedTrip }
    // { returnDocument: 'after' }
  );
  if (updatedTripInfo.lastErrorObject.n == 0) {
    throw `Error: Could not update trip successfully`;
  }
  updatedTripInfo.value._id = updatedTripInfo.value._id.toString();
  return updatedTripInfo.value;
};

// TODO
const updateDate = async (tripId, startDate, endDate) => {
  if (!tripId) {
    throw 'Error: TripID must be inputted';
  }
  if (!startDate) {
    throw `Error: Start date must be inputted`;
  }
  if (!endDate) {
    throw `Error: End date must be inputted`;
  }
  if (typeof startDate != 'string') {
    throw `Error: Start date must be a string`;
  }
  if (typeof endDate != 'string') {
    throw `Error: End date must be a string`;
  }
  let today = new Date();
  let year = today.getFullYear();
  let checkStart = startDate.split('/');
  if (
    checkStart.length != 3 ||
    checkStart[0].length != 2 ||
    checkStart[1].length != 2 ||
    checkStart[2].length != 4
  ) {
    throw `Error: Start date must be in format MM/DD/YYYY`;
  }
  if (Number(checkStart[0]) < 0 || Number(checkStart[0]) > 13) {
    throw `Error: Month must be between 01-12`;
  }
  if (Number(checkStart[1]) < 0 || Number(checkStart[1]) > 32) {
    throw `Error: Date must be between 1-31`;
  }
  if (
    (Number(checkStart[0]) == 4 ||
      Number(checkStart[0]) == 6 ||
      Number(checkStart[0]) == 9 ||
      Number(checkStart[0]) == 11) &&
    Number(checkStart[1]) > 30
  ) {
    throw `Error: April, June, September, and November have 30 days`;
  }
  if (Number(checkStart[0]) == 2 && Number(checkStart[1]) > 30) {
    throw `Error: February can only have up to 28 or 29 days`;
  }
  if (Number(checkStart[3]) < 1900 || Number(year.toString()) + 1 < Number(checkStart[3])) {
    throw `Error: Trips can only be planned one year in advance`;
  }
  let checkEnd = endDate.split('/');
  if (
    checkEnd.length != 3 ||
    checkEnd[0].length != 2 ||
    checkEnd[1].length != 2 ||
    checkEnd[2].length != 4
  ) {
    throw `Error: Start time must be in format MM/DD/YYYY`;
  }
  if (Number(checkEnd[0]) < 0 || Number(checkEnd[0]) > 13) {
    throw `Error: Month must be between 01-12`;
  }
  if (Number(checkEnd[1]) < 0 || Number(checkEnd[1]) > 32) {
    throw `Error: Date must be between 1-31`;
  }
  if (
    (Number(checkEnd[0]) == 4 ||
      Number(checkEnd[0]) == 6 ||
      Number(checkEnd[0]) == 9 ||
      Number(checkEnd[0]) == 11) &&
    Number(checkEnd[1]) > 30
  ) {
    throw `Error: April, June, September, and November have 30 days`;
  }
  if (Number(checkEnd[0]) == 2 && Number(checkEnd[1]) > 30) {
    throw `Error: February can only have up to 28 or 29 days`;
  }
  if (Number(checkEnd[3]) < 1900 || Number(year.toString()) + 1 < Number(checkEnd[3])) {
    throw `Error: Trips can only be planned one year in advance`;
  }
  if (typeof tripId != 'string') {
    throw `Error: Trip Id must be a string`;
  }
  if (tripId.trim().length == 0 || tripId.length == 0) {
    throw `Error: Trip Id must not be an empty string or only include empty spaces`;
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
  const updatedTripInfo = await tripCollection.findOneAndUpdate(
    { _id: new ObjectId(tripId) },
    { $set: updatedTrip },
    { returnDocument: 'after' }
  );
  if (updatedTripInfo.lastErrorObject.n == 0) {
    throw `Error: Could not update trip successfully`;
  }
  updatedTripInfo.value._id = updatedTripInfo.value._id.toString();
  return updatedTripInfo.value;
};

// API call??
// TODO
const updateLocation = async (tripId, startLocation, endLocation) => {
  if (!tripId) {
    throw 'Error: TripID must be inputted';
  }
  if (!startLocation) {
    throw `Error: Start time must be inputted`;
  }
  if (!endLocation) {
    throw `Error: End time must be inputted`;
  }
  if (typeof startLocation != 'string') {
    throw `Error: Start Location must be a string`;
  }
  if (typeof endLocation != 'string') {
    throw `Error: End Location must be a string`;
  }
  if (startLocation.length == 0 || startLocation.trim().length == 0) {
    throw `Error: Start location must not be an empty string or made up of empty spaces`;
  }
  if (endLocation.length == 0 || endLocation.trim().length == 0) {
    throw `Error: End location must not be an empty string or made up of empty spaces`;
  }
  if (typeof tripId != 'string') {
    throw `Error: Trip Id must be a string`;
  }
  if (tripId.trim().length == 0 || tripId.length == 0) {
    throw `Error: Trip Id must not be an empty string or only include empty spaces`;
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
  const updatedTripInfo = await tripCollection.findOneAndUpdate(
    { _id: new ObjectId(tripId) },
    { $set: updatedTrip },
    { returnDocument: 'after' }
  );
  if (updatedTripInfo.lastErrorObject.n == 0) {
    throw `Error: Could not update trip successfully`;
  }
  updatedTripInfo.value._id = updatedTripInfo.value._id.toString();
  return updatedTripInfo.value;
};

// TODO
const addToTodoList = async (tripId, task) => {
  if (!tripId || !task) {
    throw 'All fields need to have valid values';
  }
  if (!ObjectId.isValid(tripId)) {
    throw 'tripId is not a valid ObjectId';
  }
  if (typeof tripId !== 'string' || tripId.trim() === '') {
    throw 'tripId must be a non-empty string';
  }
  if (typeof task !== 'string' || task.trim() === '') {
    throw 'task must be a non-empty string';
  }
  tripId = tripId.trim();
  task = task.trim();
  const tripCollection = await trips();
  const trip = await tripCollection.findOne({ _id: ObjectId(tripId) });
  if (!trip) {
    throw 'trip does not exist';
  }
  if (!trip.to_do) {
    throw 'to_do list does not exist';
  }
  trip.to_do.push(task);
  const updatedTrip = await tripCollection.updateOne({ _id: ObjectId(tripId) }, { $set: trip });
  if (updatedTrip.modifiedCount === 0) {
    throw 'could not add task successfully';
  }
  updatedTrip.value._id = updatedTrip.value._id.toString();
  return updatedTrip.value;
};

// TODO
const deleteFromTodoList = async (tripId, task) => {
  if (!tripId || !task) {
    throw 'All fields need to have valid values';
  }
  if (!ObjectId.isValid(tripId)) {
    throw 'tripId is not a valid ObjectId';
  }
  if (typeof tripId !== 'string' || tripId.trim() === '') {
    throw 'tripId must be a non-empty string';
  }
  if (typeof task !== 'string' || task.trim() === '') {
    throw 'task must be a non-empty string';
  }
  tripId = tripId.trim();
  task = task.trim();
  const tripCollection = await trips();
  const trip = await tripCollection.findOne({ _id: ObjectId(tripId) });
  if (!trip) {
    throw 'trip does not exist';
  }
  if (!trip.to_do) {
    throw 'to_do list does not exist';
  }
  if (!trip.to_do.includes(task)) {
    throw 'task does not exist';
  }
  trip.to_do.splice(trip.to_do.indexOf(task), 1);
  const updatedTrip = await tripCollection.updateOne({ _id: ObjectId(tripId) }, { $set: trip });
  if (updatedTrip.modifiedCount === 0) {
    throw 'could not delete task successfully';
  }
  updatedTrip.value._id = updatedTrip.value._id.toString();
  return updatedTrip.value;
};

// TODO
const deleteTodoList = async (tripId) => {
  if (!tripId) {
    throw 'tripId is not provided';
  }
  if (!ObjectId.isValid(tripId)) {
    throw 'tripId is not a valid ObjectId';
  }
  if (typeof tripId !== 'string' || tripId.trim() === '') {
    throw 'tripId must be a non-empty string';
  }
  tripId = tripId.trim();
  const tripCollection = await trips();
  const trip = await tripCollection.findOne({ _id: ObjectId(tripId) });
  if (!trip) {
    throw 'trip does not exist';
  }
  trip.to_do = [];
  const updatedTrip = await tripCollection.updateOne({ _id: ObjectId(tripId) }, { $set: trip });
  if (updatedTrip.modifiedCount === 0) {
    throw 'could not delete list successfully';
  }
  updatedTrip.value._id = updatedTrip.value._id.toString();
  return updatedTrip.value;
};

// TODO
const usersAllowed = async (userId, tripId) => {
  if (!userId || !tripId) {
    throw 'All fields need to have valid values';
  }
  if (!ObjectId.isValid(userId) || !ObjectId.isValid(tripId)) {
    throw 'All fields must be valid ObjectIds';
  }
  if (typeof userId !== 'string' || userId.trim() === '') {
    throw 'userId must be a non-empty string';
  }
  if (typeof tripId !== 'string' || tripId.trim() === '') {
    throw 'tripId must be a non-empty string';
  }
  userId = userId.trim();
  tripId = tripId.trim();
  const tripCollection = await trips();
  const trip = await tripCollection.findOne({ _id: ObjectId(tripId) });
  if (!trip) {
    throw 'trip does not exist';
  }
  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: ObjectId(userId) });
  if (!user) {
    throw 'This user does not exist';
  } else {
    return true;
  }
};

export {
  createTrip,
  getAll,
  get,
  filter,
  updateTime,
  updateDate,
  updateLocation,
  addToTodoList,
  deleteFromTodoList,
  deleteTodoList,
  usersAllowed
};
