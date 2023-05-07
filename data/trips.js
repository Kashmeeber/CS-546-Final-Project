import { trips, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

// API call
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
  toDo
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
    !toDo
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
  // if (!Array.isArray(stops)) {
  //   throw 'You must provide an array of all stops on your trip';
  // }
  // if (!Array.isArray(usersAllowed)) {
  //   throw 'You must provide an array of all users allowed on your trip';
  // }
  if (startLocation == endLocation) {
    throw 'Start location cannot be the same as end location';
  }
  // if (startTime == endTime) {
  //   throw 'Start time cannot be the same as end time';
  // }
  if (startDate == endDate) {
    throw 'Start date cannot be the same as end date';
  }
  userId = userId.trim();
  tripName = tripName.trim();
  startLocation = startLocation.trim();
  startDate = startDate.trim();
  endLocation = endLocation.trim();
  endDate = endDate.trim();
  startTime = startTime.trim();
  endTime = endTime.trim();
  stops = stops.map((stop) => stop.trim());
  toDo = toDo.map((todo) => todo.trim());
  let st = startTime.split(':');
  let et = endTime.split(':');
  let regexNum = /^[0-9]*$/;
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
  let sd = startDate.split('/');
  let ed = endDate.split('/');
  let currentYear = new Date();
  let newCurrentYear = currentYear.getFullYear();
  if (sd[2] < currentYear && ed[2] > newCurrentYear + 2) {
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
  if (sd[2] * 1 < 1900 || sd[2] * 1 > ed[2] * 1) {
    throw 'Error: Must provide start date in MM/DD/YYYY format';
  }
  if (
    ed.length != 3 ||
    ed[0].length != 2 ||
    ed[1].length != 2 ||
    ed[2].length != 4 ||
    !regexNum.test(ed[0]) ||
    !regexNum.test(ed[1]) ||
    !regexNum.test(ed[2])
  ) {
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
    overallCost: 0
  };
  const tripCollection = await trips();
  if (await tripCollection.findOne({ name: tripName })) {
    throw 'Error: Trip name already exists';
  }
  const insertInfo = await tripCollection.insertOne(newTrip);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add trip';
  const newId = insertInfo.insertedId.toString();
  const trip = await get(newTrip.name);
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

const get = async (name) => {
  if (!name) {
    throw 'You must provide an id to search for';
  }
  if (typeof name !== 'string') {
    throw 'Id must be a string';
  }
  if (name.trim().length === 0) {
    throw 'Id cannot be an empty string or just spaces';
  }
  name = name.trim();
  // if (!ObjectId.isValid(id)) {
  //   throw 'invalid object ID';
  // }
  const tripCollection = await trips();
  const trip = await tripCollection.findOne({ name: name });
  if (trip === null) {
    throw 'No trip with that id';
  }
  // trip._id = trip._id.toString();
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
  if (startTime == endTime) {
    throw 'Error: Start time cannot be the same as end time';
  }
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
  if (typeof tripId != 'string') {
    throw `Error: Trip Id must be a string`;
  }
  if (tripId.trim().length == 0 || tripId.length == 0) {
    throw `Error: Trip Id must not be an empty string or only include empty spaces`;
  }
  tripId = tripId.trim();
  const oldTrip = await get(tripId);
  if (startTime == oldTrip.start_time && endTime == oldTrip.end_time) {
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
    to_do: oldTrip.to_do,
    overallCost: oldTrip.overallCost
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
  if (startDate == endDate) {
    throw 'Error: Start date cannot be the same as end date';
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
  if (Number(checkStart[0]) == 2 && Number(checkStart[1]) > 29) {
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
  if (Number(checkEnd[0]) == 2 && Number(checkEnd[1]) > 29) {
    throw `Error: February can only have up to 28 or 29 days`;
  }
  if (year.toString() + 2 > Number(checkEnd[2])) {
    throw `Error: Trips can only be planned two years in advance`;
  }
  if (Number(checkEnd[2]) < Number(checkStart[2])) {
    throw `Error: End date must be after start date`;
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
    userId: oldTrip.userId,
    name: oldTrip.name,
    start_location: oldTrip.start_location,
    start_date: startDate,
    start_time: oldTrip.start_time,
    end_location: oldTrip.end_location,
    end_date: endDate,
    end_time: oldTrip.end_time,
    stops: oldTrip.stops,
    itinerary: oldTrip.itinerary,
    to_do: oldTrip.to_do,
    users_allowed: oldTrip.users_allowed
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

// API call
const updateLocation = async (tripId, startLocation, endLocation) => {
  if (!tripId) {
    throw 'Error: TripID must be inputted';
  }
  if (!startLocation) {
    throw `Error: Start location must be inputted`;
  }
  if (!endLocation) {
    throw `Error: End location must be inputted`;
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
  if (startLocation == endLocation) {
    throw 'Start location is the same as end location';
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
  if (startLocation == oldTrip.start_location && endLocation == oldTrip.end_location) {
    throw `Error: Start and end locations are the same as before`;
  }
  const updatedTrip = {
    userId: oldTrip.userId,
    name: oldTrip.name,
    start_location: startLocation,
    start_date: oldTrip.start_date,
    start_time: oldTrip.start_time,
    end_location: endLocation,
    end_date: oldTrip.end_date,
    end_time: oldTrip.end_time,
    stops: oldTrip.stops,
    itinerary: oldTrip.itinerary,
    to_do: oldTrip.to_do,
    users_allowed: oldTrip.users_allowed
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
    throw 'Task must be a non-empty string';
  }
  tripId = tripId.trim();
  task = task.trim();
  const tripCollection = await trips();
  const trip = await tripCollection.findOne({ _id: new ObjectId(tripId) });
  if (!trip) {
    throw 'Trip does not exist';
  }
  if (!trip.to_do) {
    throw 'To-do list does not exist';
  }
  trip.to_do.push(task);
  const updatedTrip = await tripCollection.findOneAndUpdate(
    { _id: new ObjectId(tripId) },
    { $set: trip },
    { returnDocument: 'after' }
  );
  if (updatedTrip.lastErrorObject.n == 0) {
    throw 'Could not add task to to-do list';
  }
  updatedTrip.value._id = updatedTrip.value._id.toString();
  return updatedTrip.value;
};

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
    throw 'Task must be a non-empty string';
  }
  tripId = tripId.trim();
  task = task.trim();
  const tripCollection = await trips();
  const trip = await tripCollection.findOne({ _id: new ObjectId(tripId) });
  if (!trip) {
    throw 'Trip does not exist';
  }
  if (!trip.to_do) {
    throw 'To-do list does not exist';
  }
  if (!trip.to_do.includes(task)) {
    throw 'Task does not exist';
  }
  trip.to_do.splice(trip.to_do.indexOf(task), 1);
  const updatedTrip = await tripCollection.findOneAndUpdate(
    { _id: new ObjectId(tripId) },
    { $set: trip },
    { returnDocument: 'after' }
  );
  if (updatedTrip.lastErrorObject.n == 0) {
    throw 'Could not delete task successfully';
  }
  updatedTrip.value._id = updatedTrip.value._id.toString();
  return updatedTrip.value;
};

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
  const trip = await tripCollection.findOne({ _id: new ObjectId(tripId) });
  if (!trip) {
    throw 'Trip does not exist';
  }
  trip.to_do = [];
  const updatedTrip = await tripCollection.findOneAndUpdate(
    { _id: new ObjectId(tripId) },
    { $set: trip },
    { returnDocument: 'after' }
  );
  if (updatedTrip.lastErrorObject.n == 0) {
    throw 'Could not delete to-do list successfully';
  }
  updatedTrip.value._id = updatedTrip.value._id.toString();
  return updatedTrip.value;
};

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
  const trip = await tripCollection.findOne({ _id: new ObjectId(tripId) });
  if (!trip) {
    throw 'Trip does not exist';
  }
  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw 'This user does not exist';
  } else {
    return true;
  }
};

const remove = async (tripId) => {
  if (!tripId) {
    throw 'You must provide an id to search for';
  }
  if (typeof tripId !== 'string') {
    throw 'Id must be a string';
  }
  if (tripId.trim().length === 0) {
    throw 'id cannot be an empty string or just spaces';
  }
  tripId = tripId.trim();
  if (!ObjectId.isValid(tripId)) {
    throw 'invalid object ID';
  }
  const tripCollection = await trips();
  const deletionInfo = await tripCollection.findOneAndDelete({
    _id: new ObjectId(tripId)
  });

  if (deletionInfo.lastErrorObject.n === 0) {
    throw `Could not delete trip with id of ${tripId}`;
  }
  // return `${deletionInfo.value.name} has been successfully deleted!`;
  return { 'tripId': `${deletionInfo.value.tripId}`, 'deleted': true };
};

const update = async (
  nameParams,
  tripName,
  startLocation,
  startDate,
  startTime,
  endLocation,
  endDate,
  endTime,
  stops,
  toDo
) => {
  // console.log(1)
  if (
      !nameParams ||
      !tripName ||
      !startLocation ||
      !startDate ||
      !startTime ||
      !endLocation ||
      !endDate ||
      !endTime
    ) {
      throw 'Error: All fields need to have valid values';
    }
    if (typeof nameParams != 'string' || nameParams.trim().length == 0) {
      throw 'Error: Must provide the trip name as valid nonempty string';
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
  // if (!Array.isArray(toDo) || toDo.length == 0) {
  //   throw 'Error: Must provide to-do list as valid nonempty array';
  // }
  if (typeof endDate != 'string' || endDate.trim().length == 0) {
    throw 'Error: Must provide end date as valid nonempty string';
  }
  if (typeof startTime != 'string' || startTime.trim().length == 0) {
    throw 'Error: Must provide start time as valid nonempty string';
  }
  if (typeof endTime != 'string' || endTime.trim().length == 0) {
    throw 'Error: Must provide end time as valid nonempty string';
  }
  // if (!Array.isArray(stops)) {
  //   throw 'You must provide an array of all stops on your trip';
  // }
  // if (!Array.isArray(usersAllowed)) {
  //   throw 'You must provide an array of all users allowed on your trip';
  // }
  if (startLocation == endLocation) {
    throw 'Start location cannot be the same as end location';
  }
  // if (startTime == endTime) {
  //   throw 'Start time cannot be the same as end time';
  // }
  if (startDate == endDate) {
    throw 'Start date cannot be the same as end date';
  }
  // userId = userId.trim();
  tripName = tripName.trim();
  startLocation = startLocation.trim();
  startDate = startDate.trim();
  endLocation = endLocation.trim();
  endDate = endDate.trim();
  startTime = startTime.trim();
  endTime = endTime.trim();
  // stops = stops.map((stop) => stop.trim());
  // toDo = toDo.map((todo) => todo.trim());
  let st = startTime.split(':');
  let et = endTime.split(':');
  let regexNum = /^[0-9]*$/;
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
  let sd = startDate.split('/');
  let ed = endDate.split('/');
  let currentYear = new Date();
  let newCurrentYear = currentYear.getFullYear();
  if (sd[2] < currentYear && ed[2] > newCurrentYear + 2) {
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
  if (sd[2] * 1 < 1900 || sd[2] * 1 > ed[2] * 1) {
    throw 'Error: Must provide start date in MM/DD/YYYY format';
  }

  if (
    ed.length != 3 ||
    ed[0].length != 2 ||
    ed[1].length != 2 ||
    ed[2].length != 4 ||
    !regexNum.test(ed[0]) ||
    !regexNum.test(ed[1]) ||
    !regexNum.test(ed[2])
  ) {
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
  // console.log(10)

  // Check that the id is provided
  // console.log(1);
  // if (
  //   !nameParams ||
  //   !tripName ||
  //   !startLocation ||
  //   !startDate ||
  //   !startTime ||
  //   !endLocation ||
  //   !endDate ||
  //   !endTime ||
  //   !stops ||
  //   !toDo ||
  //   !usersAllowed
  // ) {
  //   throw 'Error: All fields need to have valid values';
  // }
  // if (typeof nameParams != 'string' || nameParams.trim().length == 0) {
  //   throw 'Error: Must provide the trip name as valid nonempty string';
  // }
  // if (typeof tripName != 'string' || tripName.trim().length == 0) {
  //   throw 'Error: Must provide the trip name as valid nonempty string';
  // }
  // if (typeof startLocation != 'string' || startLocation.trim().length == 0) {
  //   throw 'Error: Must provide the start location as valid nonempty string';
  // }
  // if (typeof startDate != 'string' || startDate.trim().length == 0) {
  //   throw 'Error: Must provide start date as valid nonempty string';
  // }
  // if (typeof endLocation != 'string' || endLocation.trim().length == 0) {
  //   throw 'Error: Must provide the end location as valid nonempty string';
  // }
  // if (!Array.isArray(toDo) || toDo.length == 0) {
  //   throw 'Error: Must provide to-do list as valid nonempty array';
  // }
  // if (typeof endDate != 'string' || endDate.trim().length == 0) {
  //   throw 'Error: Must provide end date as valid nonempty string';
  // }
  // if (typeof startTime != 'string' || startTime.trim().length == 0) {
  //   throw 'Error: Must provide start time as valid nonempty string';
  // }
  // if (typeof endTime != 'string' || endTime.trim().length == 0) {
  //   throw 'Error: Must provide end time as valid nonempty string';
  // }
  // if (!Array.isArray(stops)) {
  //   throw 'You must provide an array of all stops on your trip';
  // }
  // if (!Array.isArray(usersAllowed)) {
  //   throw 'You must provide an array of all users allowed on your trip';
  // }
  // if (startLocation == endLocation) {
  //   throw 'Start location cannot be the same as end location';
  // }
  // if (startTime == endTime) {
  //   throw 'Start time cannot be the same as end time';
  // }
  // if (startDate == endDate) {
  //   throw 'Start date cannot be the same as end date';
  // }
  // nameParams = nameParams.trim();
  // tripName = tripName.trim();
  // startLocation = startLocation.trim();
  // startDate = startDate.trim();
  // endLocation = endLocation.trim();
  // endDate = endDate.trim();
  // startTime = startTime.trim();
  // endTime = endTime.trim();
  // stops = stops.map((stop) => stop.trim());
  // toDo = toDo.map((todo) => todo.trim());
  // usersAllowed = usersAllowed.map((user) => user.trim());
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
  // let sd = startDate.split('/');
  // let ed = endDate.split('/');
  // let currentYear = new Date();
  // let newCurrentYear = currentYear.getFullYear();
  // if (sd[2] < currentYear && ed[2] > newCurrentYear + 2) {
  //   throw 'The start date cannot be in the past and the end date cannot be more than 2 years than today';
  // }
  // if (sd.length != 3 || sd[0].length != 2 || sd[1].length != 2 || sd[2].length != 4) {
  //   throw 'Error: Must provide start date in MM/DD/YYYY format';
  // }
  // if (sd[0] * 1 < 1 || sd[0] * 1 > 12) {
  //   throw 'Error: Must provide start date in MM/DD/YYYY format';
  // }
  // if (sd[1] * 1 < 1 || sd[1] * 1 > 31) {
  //   throw 'Error: Must provide start date in MM/DD/YYYY format';
  // }
  // if (sd[2] * 1 < 1900 || sd[2] * 1 > ed[2] * 1) {
  //   throw 'Error: Must provide start date in MM/DD/YYYY format';
  // }
  // if (ed.length != 3 || ed[0].length != 2 || ed[1].length != 2 || ed[2].length != 4) {
  //   throw 'Error: Must provide end date in MM/DD/YYYY format';
  // }
  // if (ed[0] * 1 < 1 || ed[0] * 1 > 12) {
  //   throw 'Error: Must provide end date in MM/DD/YYYY format';
  // }
  // if (ed[1] * 1 < 1 || ed[1] * 1 > 31) {
  //   throw 'Error: Must provide end date in MM/DD/YYYY format';
  // }
  // if (ed[2] * 1 < sd[2] * 1 || ed[2] * 1 > ed[2] * 1 + 1) {
  //   throw 'Error: Must provide end date in MM/DD/YYYY format';
  // }
  // if (sd > ed) {
  //   throw 'Error: Start date must be set to a date before end date';
  // }
  // if (stops.length === 0) throw 'You must supply at least one stop';
  // for (let i in stops) {
  //   if (typeof stops[i] !== 'string' || stops[i].trim().length === 0) {
  //     throw 'You must supply at least 1 stop';
  //   }
  //   stops[i] = stops[i].trim();
  // }
  // if (toDo.length === 0) throw 'You must supply at least one to-do item';
  // for (let i in toDo) {
  //   if (typeof toDo[i] !== 'string' || toDo[i].trim().length === 0) {
  //     throw 'You must supply at least 1 to-do item';
  //   }
  //   toDo[i] = toDo[i].trim();
  // }
  const tripCollection = await trips();
  // if (await tripCollection.findOne({ name: tripName })) {
  //   throw 'Error: Trip name already exists';
  // }
  const trip = await tripCollection.findOne({ name: nameParams });

  const updatedtrip = {
    userId: trip.userId,
    name: tripName,
    start_location: startLocation,
    start_date: startDate,
    start_time: startTime,
    end_location: endLocation,
    end_date: endDate,
    end_time: endTime,
    stops: stops,
    itinerary: trip.itinerary,
    to_do: toDo,
    overallCost: trip.overallCost
  };
  const updatedInfo = await tripCollection.replaceOne({ name: nameParams }, updatedtrip);

  if (updatedInfo.modifiedCount === 0) {
    throw 'Could not update band successfully';
  }

  return await get(tripName);
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
  usersAllowed,
  remove,
  update
};
