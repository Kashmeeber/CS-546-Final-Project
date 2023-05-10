# CS-546-Final-Project (CART)

Built using HTML, CSS, Express, MongoDB, and Node.js

How to Setup

Run 'npm install' to install the required dependencies for our project.

Run 'npm run seed' to populate the database with data.

Run 'npm run start' to start the server.

Go to localhost:3000 to load the website.

How the Application Works

After registering for the website, you can login, and following the header on top can go to the user's profile, the trip planning page, the homepage, or logout. After planning a trip, you will be sent to a page that includes a map, showcasing the trip route, as well as directions to take and other information about the route. You can also share the trip with other users, and if a user who has not been shared tries to access the trip, they will reach a Access Denied page. You can also create itineraries, edit them, and edit the trips as well.

Final Database: https://github.com/Kashmeeber/CS-546-Final-Project

API Keys

This web application integrates the Google Maps API. In order to run the application properly, request API keys from Google Map and then insert that key into the the src url in the main.handlebars header and the maps.handlebars footer. Replace the entire ${INSERT_APIKEY_HERE} with the APIKEY.