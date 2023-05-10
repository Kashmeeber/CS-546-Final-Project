import { userData, tripsData, itineraryData } from '../data/index.js';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { trips } from '../config/mongoCollections.js';

//lets drop the database each time this is run
const db = await dbConnection();
await db.dropDatabase();

async function main() {
  try {
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
  try {
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
  try {
    const user3 = await userData.createUser('Mariam', 'Dardir', 'mdardir@gmail.com', 'Hello123!');
    const user3_trip1 = await tripsData.createTrip(
      user3._id.toString(),
      'the americas tour',
      'Quito, Ecuador',
      '12/30/2023',
      '23:00',
      'Rio de Janeiro, Brazil',
      '01/05/2024',
      '05:00',
      ['Santiago, Chile'],
      ['renew passport', 'buy museum tickets', 'get cash', 'pack bags'],
      ['svyaslol@gmail.com']
    );
    const user3_trip1_activity = await itineraryData.createActivity(
      user3_trip1.name,
      'Dig a hole',
      '12/30/2023',
      '03:13',
      '03:14',
      5,
      'haha, hehe, hoho'
    );
    const user3_trip1_activity2 = await itineraryData.createActivity(
      user3_trip1.name,
      'Goes to convience store to buy gloves',
      '12/30/2023',
      '03:15',
      '03:30',
      15,
      'haha, hehe, hoho'
    );
    const user3_trip1_activity3 = await itineraryData.createActivity(
      user3_trip1.name,
      'Buy acid',
      '12/30/2023',
      '03:31',
      '03:35',
      10,
      'haha, hehe, hoho'
    );
    const user3_trip1_activity4 = await itineraryData.createActivity(
      user3_trip1.name,
      'Fill the hole',
      '12/30/2023',
      '03:36',
      '04:00',
      0,
      'haha, hehe, hoho'
    );
    const user3_trip2 = await tripsData.createTrip(
      user3._id.toString(),
      'the crisis',
      'New York, NY',
      '02/14/2024',
      '12:00',
      'Jersey City, NJ',
      '03/28/2024',
      '12:00',
      ['San Francisco, CA'],
      ['buy a house', 'buy a car', 'buy a dog', 'buy a cat', 'buy a fish'],
      ['areeb@gmail.com', 'svyaslol@gmail.com']
    );
    const user3_trip2_addStop = await itineraryData.addStop(user3_trip2.name, 'Boston, MA');
    const user3_trip2_addStop2 = await itineraryData.addStop(user3_trip2.name, 'Las Vegas, NV');
    const user3_trip2_activity1 = await itineraryData.createActivity(
      user3_trip2.name,
      'Cry',
      '02/14/2024',
      '12:00',
      '12:01',
      0,
      ':('
    );
    const user3_trip2_activity2 = await itineraryData.createActivity(
      user3_trip2.name,
      'Cry some more',
      '02/14/2024',
      '12:01',
      '12:02',
      0,
      ':('
    );
  } catch (e) {
    console.log('User 3: ' + e);
  }
  try {
    const user4 = await userData.createUser(
      'tamnhu',
      'nguyen',
      'tamnhunguyen@gmail.com',
      'Password@123'
    );
    const user4_trip1 = await tripsData.createTrip(
      user4._id.toString(),
      'summertime sadness',
      'New York, NY',
      '06/01/2024',
      '12:00',
      'Los Angeles, CA',
      '06/30/2024',
      '12:00',
      ['San Francisco, CA'],
      ['buy tickets', 'buy a car', 'get gas', 'buy food'],
      ['svyaslol@gmail.com', 'areeb@gmail.com', 'mdardir@gmail.com']
    );
    const user4_trip1_addStop = await itineraryData.addStop(user4_trip1.name, 'Boston, MA');
    const user4_trip1_activity1 = await itineraryData.createActivity(
      user4_trip1.name,
      'Go to the beach',
      '06/01/2024',
      '01:00',
      '02:00',
      0,
      'swim, tan, relax'
    );
    const user4_trip1_activity2 = await itineraryData.createActivity(
      user4_trip1.name,
      'Go to the pool',
      '06/01/2024',
      '02:00',
      '03:00',
      0,
      'more swimming, tanning, relaxing'
    );
    const user4_trip2 = await tripsData.createTrip(
      user4._id.toString(),
      'birthday bash',
      'Jersey City, NJ',
      '01/02/2024',
      '00:00',
      'Orlando, FL',
      '01/05/2024',
      '00:00',
      ['Miami, FL'],
      ['eat cake', 'buy presents', 'buy decorations', 'buy food'],
      []
    );
    const user4_trip2_activity1 = await itineraryData.createActivity(
      user4_trip2.name,
      'Shopping',
      '01/02/2024',
      '11:00',
      '12:00',
      0,
      'buy presents, decorations, food'
    );
  } catch (e) {
    console.log('User 4: ' + e);
  }
}

await main();
await closeConnection();
