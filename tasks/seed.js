import { userData, tripsData, itineraryData } from '../data/index.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';

//lets drop the database each time this is run
const db = await dbConnection();
await db.dropDatabase();

async function main() {
    try{
        const user1 = await userData.createUser("Areeb", "Chaudhry", "areeb@gmail.com", "Qwertyuiop@123");  
        const user1_trip1 = await tripsData.createTrip(user1._id.toString(), "Trip 1", "Jersey City, NJ", "05/25/2023", "08:00", "New York City, NY", "05/26/2023", "09:00", ["Newport Mall","Hamilton Park Montessori School"], ["Chillax"]);
        const user1_trip2 = await tripsData.createTrip(user1._id.toString(), "Trip 2", "San Francisco, CA", "05/25/2023", "08:00", "Jersey City, NJ", "05/26/2023", "09:00", ["Salt Lake City, UT","Kansas City, MO"], ["Chillax"]);  
        const user1_activity1 = await itineraryData.createActivity(user1_trip1.name, "Watching a KCC game", "05/25/2023", "11:00", "14:00", 50);
        const user1_addStop = await itineraryData.addStop(user1_trip1.name, "Madison Square Garden");
    }
    catch(e){
        console.log("User 1: " + e);
    }
    try{
        const user2 = await userData.createUser("big", "bird", "sunglasses2@gmail.com", "lalalalalA25!"); 
    }
    catch(e){
        console.log("User 2: " + e);
    }
    try{
        const user3 = await userData.createUser("Shailaja", "Vyas", "svyaslol@gmail.com", "Hello123!");    
    }
    catch(e){
        console.log("User 3: " + e);
    }

    // try{
    //     const pinkFloyd = await bands.checkUser("SUNGLASSES@gmail.com", "lalalalala3939!");
    //     console.log(pinkFloyd);
    // }
    // catch(e){
    //     console.log(e);
    // }


    // try{
    //     const pinkFloyd = await bands.create("5sos", ["Pop", "Underground", "Indie"], "http://www.fivesecondsofsummer.com", "POP", ["Luke", "Calumn", "Aston", "Michael" ], 2013, "5555555");
    //     console.log(pinkFloyd);
    // }
    // catch(e){
    //     console.log(e);
    // }

    // try{
    //     const allBands = await bands.getAll();
    //     console.log(allBands);
    // }
    // catch(e){
    //     console.log(e);
    // }

    // try{
    //     const linkinPark = await bands.get("63f8f09e1f91e428e5d7d09a"); 
    //     console.log(linkinPark); 
    // }
    // catch(e){
    //     console.log(e);
    // }


    // try{
    //     const renamedBeatles = await bands.rename("63f8f122bcbb6deaec3203ee", "Lennon's Boys"); 
    //     console.log(renamedBeatles); 
    // }
    // catch(e){
    //     console.log(e);
    // }

    
}

await main();
await closeConnection();