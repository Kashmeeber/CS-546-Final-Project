// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

import { Router } from "express";
const router = Router();
import {tripsData} from "../data/index.js";
import validation from "../validation.js";

router
  .route("/:userId")
  .get(async (req, res) => {
    //code here for GET
    try {
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
    try {
      const trip = await tripsData.createTrip(
        req.params.userId, 
        req.body.tripName, 
        req.body.startLocation, 
        req.body.startDate, 
        req.body.startTime,
        req.body.endLocation, 
        req.body.endDate, 
        req.body.endTime, 
        req.body.stops, 
        req.body.toDo,
        req.body.usersAllowed);
      return res.status(200).json(trip);
    } catch (e) {
        return res.status(400).json(e);
    }
  });


router
  .route("/:tripId")
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
      return res.status(200).json({ tripId: req.params.tripId, deleted: true });
    } catch (e) {
      // if the id is not a valid ObjectId, return a 400
      if (e === "The id provided is not a valid ObjectId") {
        return res.status(400).json(e);
      }
      // if no band exists with that id, return a 404
      if (e === "Could not delete trip with this id") {
        return res.status(404).json(e);
      }
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    try {
      req.params.tripId = validation.checkId(req.params.tripId);
      const updatedTrip = await tripsData.update(req.params.tripId, req.body.startLocation, req.body.endLocation, 
        req.body.startDate, req.body.endDate, req.body.startTime, req.body.endTime);
      return res.status(200).json(updatedTrip);
    } catch (e) {
        return res.status(400).json(e);
    }
  });
// make a post and delete route /itinerary/:tripId
export default router;
