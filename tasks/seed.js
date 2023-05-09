import { userData, tripsData, itineraryData } from '../data/index.js';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';

//lets drop the database each time this is run
const db = await dbConnection();
await db.dropDatabase();

async function main() {
  // Create first user and trips/itineraries
  try {
    // User 1
    const user1 = await userData.createUser(
      'Areeb',
      'Chaudhry',
      'areeb@gmail.com',
      'Qwertyuiop@123'
    );
    const user1_trip1 = await tripsData.createTrip(
      user1._id.toString(),
      'Trip 1',
      'Jersey City, NJ',
      '05/25/2023',
      '08:00',
      'New York City, NY',
      '05/26/2023',
      '09:00',
      ['Newport Mall', 'Hamilton Park Montessori School'],
      ['Chillax'],
      []
    );
    const user1_trip1_activity1 = await itineraryData.createActivity(
      user1_trip1.name,
      'Watching a KCC game',
      '05/25/2023',
      '11:00',
      '14:00',
      50
    );
    const user1_trip1_activity2 = await itineraryData.createActivity(
      user1_trip1.name,
      'Going to the mall',
      '05/25/2023',
      '15:00',
      '17:00',
      50
    );
    const user1_trip1_addStop = await itineraryData.addStop(
      user1_trip1.name,
      'Madison Square Garden'
    );
    const user1_trip2 = await tripsData.createTrip(
      user1._id.toString(),
      'Trip 2',
      'San Francisco, CA',
      '07/30/2023',
      '10:00',
      'Jersey City, NJ',
      '08/09/2023',
      '18:00',
      ['Salt Lake City, UT', 'Kansas City, MO'],
      ['Get gas', 'Get food', 'Get drinks'],
      []
    );
    const user1_trip2_activity1 = await itineraryData.createActivity(
      user1_trip2.name,
      'Going to the beach',
      '07/30/2023',
      '11:00',
      '14:00',
      50
    );
    const user1_trip2_activity2 = await itineraryData.createActivity(
      user1_trip2.name,
      'Going to the mall',
      '08/01/2023',
      '15:00',
      '17:00',
      50
    );
    const user1_trip2_addStop = await itineraryData.addStop(user1_trip2.name, 'Seattle, WA');
    const user1_trip2_addStop2 = await itineraryData.addStop(user1_trip2.name, 'Portland, OR');
  } catch (e) {
    console.log('User 1: ' + e);
  }
  // Create second user and trips/itineraries
  try {
    // User 2
    const user2 = await userData.createUser('Shailaja', 'Vyas', 'svyaslol@gmail.com', 'Hello!123');
    const user2_trip1 = await tripsData.createTrip(
      user2._id.toString(),
      'sad times :(',
      'Jersey City, NJ',
      '11/25/2023',
      '01:00',
      'Orlando, FL',
      '12/12/2023',
      '09:00',
      ['Atlanta, GA', 'Miami, FL'],
      ['Pack tissues', 'Get Dunkin', 'Get comfort food', 'Cry'],
      []
    );
    const user2_trip1_addStop = await itineraryData.addStop(user2_trip1.name, 'Washington, DC');
    const user2_trip1_addStop2 = await itineraryData.addStop(user2_trip1.name, 'Richmond, VA');
    const user2_trip1_activity1 = await itineraryData.createActivity(
      user2_trip1.name,
      'Going to the movies',
      '11/26/2023',
      '11:00',
      '14:00',
      100
    );
    const user2_trip1_activity2 = await itineraryData.createActivity(
      user2_trip1.name,
      'Shopping',
      '12/10/2023',
      '20:00',
      '22:00',
      200
    );
    const user2_trip2 = await tripsData.createTrip(
      user2._id.toString(),
      'world tour',
      'London, UK',
      '01/01/2024',
      '01:00',
      'Paris, France',
      '01/10/2024',
      '09:00',
      ['Rome, Italy', 'Berlin, Germany'],
      ['Practice French', 'Practice Italian', 'Practice German'],
      ['areeb@gmail.com']
    );
    const user2_trip2_addStop = await itineraryData.addStop(
      user2_trip2.name,
      'Amsterdam, Netherlands'
    );
    const user2_trip2_addStop2 = await itineraryData.addStop(user2_trip2.name, 'Brussels, Belgium');
    const user2_trip2_activity1 = await itineraryData.createActivity(
      user2_trip2.name,
      'Eiffel Tower',
      '01/02/2024',
      '20:00',
      '23:00',
      100
    );
    const user2_trip2_activity2 = await itineraryData.createActivity(
      user2_trip2.name,
      'Colosseum',
      '01/05/2024',
      '20:00',
      '23:00',
      100
    );
  } catch (e) {
    console.log('User 2: ' + e);
  }
}

await main();
await closeConnection();
