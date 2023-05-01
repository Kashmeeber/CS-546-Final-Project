// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

import { Router } from "express";
const router = Router();
import {tripsData} from "../data/index.js";
import {itineraryData} from "../data/index.js";

import validation from "../validation.js";

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET
    try {
      // const trips = await tripsData.getAll(req.session.user.id);
      return res.render("tripplanning", {userId: req.session.user.id});
    } catch (e) {
      return res.status(500).json(e);
    }
  });

router
  .route("/:userId")
  .get(async (req, res) => {
    //code here for GET
    try {
      // console.log(req.session.user.id)
      const trips = await tripsData.getAll(req.params.userId);
    //   const returnTrips = bands.map((trip) => {
    //     return {
    //       _id: trip._id,
    //       name: trip.name
    //     }
    //   });
    // console.log(trips)
      return res.json(trips);
    } catch (e) {
      return res.status(500).json(e);
    }
  })
  .post(async (req, res) => {
    //code here for POST
    let tripInfo = req.body;
    let toDoArr = []
    let stopsArr = []

    let splitToDo = tripInfo.toDoInput.split(',')
    let splitStops = tripInfo.stopsInput.split(',')

    for(let i = 0; i < splitToDo.length; i++) {
      toDoArr.push(splitToDo[i]);
    }

    for(let i = 0; i < splitStops.length; i++) {
      stopsArr.push(splitStops[i]);
    }

    try {
      const trip = await tripsData.createTrip(
        req.params.userId, 
        req.body.tripNameInput, 
        req.body.startLocationInput, 
        req.body.startDateInput, 
        req.body.startTimeInput,
        req.body.endLocationInput, 
        req.body.endDateInput, 
        req.body.endTimeInput, 
        stopsArr, 
        toDoArr,
        req.body.usersAllowedInput);
      return res.status(200).json(trip);
    } catch (e) {
        return res.status(400).json(e);
    }
  });


router
  .route("/trip/:tripId")
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.tripId = validation.checkId(req.params.tripId);
      const trip = await tripsData.get(req.params.tripId);
      return res.status(200).json(trip);
    } catch (e) {
      // if the id is not a valid ObjectId, return a 400
      if (e == "The id provided is not a valid ObjectId") {
        return res.status(400).json(e);
      }
      // if no band exists with that id, return a 404
      if (e == "No trip with that id") {
        return res.status(404).json(e);
      }
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      req.params.tripId = validation.checkId(req.params.tripId);
      const deletedTrip = await tripsData.remove(req.params.tripId);
      return res.status(200).json(deletedTrip);
    } catch (e) {
      // if no band exists with that id, return a 404
        return res.status(404).json(e);
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    try {
      req.params.tripId = validation.checkId(req.params.tripId);
      const updatedTrip = await tripsData.update(req.params.tripId,req.body.tripName, req.body.startLocation, 
        req.body.startDate, req.body.startTime, req.body.endLocation, req.body.endDate, req.body.endTime, req.body.stops, req.body.toDo, 
        req.body.usersAllowed);
      return res.status(200).json(updatedTrip);
    } catch (e) {
        return res.status(400).json(e);
    }
  });
// make a post and delete route /itinerary/:tripId
router
  .route("/itinerary/:tripId")
  .post(async (req, res) => {
    try{
      req.params.tripId = validation.checkId(req.params.tripId);
      const itinerary = await itineraryData.createActivity( req.params.tripId, req.body.activityName,
      req.body.date, req.body.startTime, req.body.endTime, req.body.cost, req.body.notes);
      return res.status(200).json(itinerary);
    }catch(e){
      return res.status(400).json(e);
    }
  });

  router
  .route("/itinerary/:tripId/:itineraryId")
  .delete(async (req, res) => {
    try {
      req.params.tripId = validation.checkId(req.params.tripId);
      req.params.itineraryId = validation.checkId(req.params.itineraryId);
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      let deletedTrip = await itineraryData.removeActivity(req.params.tripId, req.params.itineraryId);
      return res.json(deletedTrip);
    } catch (e) {
      return res.status(500).send({error: e});
    }
  })
  .put(async (req, res) => {
    try {
      req.params.tripId = validation.checkId(req.params.tripId);
      req.params.itineraryId = validation.checkId(req.params.itineraryId);
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      let updatedTrip = await itineraryData.updateActivity(req.params.tripId, req.params.itineraryId,
        req.body.activityName, req.body.date, req.body.startTime, req.body.endTime, req.body.cost, req.body.notes);
      return res.json(updatedTrip);
    } catch (e) {
      return res.status(500).send({error: `${e}`});
    }
  });
export default router;
