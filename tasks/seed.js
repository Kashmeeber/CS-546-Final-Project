import * as trips from '../data/users.js'
import {dbConnection, closeConnection} from '../config/mongoConnection.js';

//lets drop the database each time this is run
const db = await dbConnection();
// await db.dropDatabase();

async function main() {
    try{
        const pinkFloyd = await bands.createUser("big", "bird", "sunglasses2@gmail.com", "lalalalalA25!", "admin");    }
    catch(e){
        console.log(e);
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