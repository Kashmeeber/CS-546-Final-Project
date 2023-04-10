import * as d from '../data/index.js';
import {trips} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const createTrip = async (tripId, 
    activityName,
    date,
    startTime,
    endTime, 
    cost,
    notes) => {
        if(!tripId || !activityName || !date || !startTime || !endTime || !cost){
            throw 'Error: All fields need to have valid values';
          }
          if(typeof tripId != 'string' || tripId.trim().length == 0){
            throw 'Error: Must provide trip id as valid nonempty string';
          }
          tripId = tripId.trim();
          if(typeof activityName != 'string' || activityName.trim().length == 0){
            throw 'Error: Must provide activity name as valid nonempty string';
          }
          activityName = activityName.trim();
          if(typeof date != 'string' || date.trim().length == 0){
            throw 'Error: Must provide date as valid nonempty string';
          }
          date = date.trim();
          if(typeof startTime != 'string' || startTime.trim().length == 0){
            throw 'Error: Must provide start time as valid nonempty string';
          }
          startTime = startTime.trim();
          if(typeof endTime != 'string' || endTime.trim().length == 0){
            throw 'Error: Must provide end time as valid nonempty string';
          }
          endTime = endTime.trim();
          if(typeof cost != 'string' || cost.trim().length == 0){
            throw 'Error: Must provide cost as valid nonempty string';
          }
          cost = cost.trim();
          let newItinerary = {
            _id: new ObjectId(),
            tripId: tripId, 
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
         
           existingItinerary.push(newItinerary);
         
           // console.log(existingAlbums)
           for(let i = 0; i < existingItinerary.length; i++){
             existingCost = existingCost + existingItinerary[i].cost;
           }
         //got off slack
           // console.log(existingRatings)
           existingCost = Number.parseFloat(existingCost.toFixed(2));
           // console.log(existingRatings)
         
           let updateFields = {
             albums: existingItinerary,
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
             throw 'Could not add initnerary';
           }
             
           let newId = newItinerary["_id"].toString();
           newItinerary["_id"] = newId;
           return newItinerary;
    };