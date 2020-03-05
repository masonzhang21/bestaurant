# Try it out!
https://consensus-9226f.firebaseapp.com/

# Bestaurant
Need help deciding where you and your group are going to eat?
From "I don't really care" to "let's eat vegetarian today",
Bestaurant has got you covered. Click create and choose a bunch of filters (price, location, cuisine, &amp; much more!). 
Our nifty algorithm will generate 5 amazing matches for y'all along with a code to a survey. Share the code with everyone so they can rate the restaurants on a scale of 1 to 5, and you'll quickly see what the best restaurant for your party is. The days of indecision are over!

# What it does and How it works
A person ("group leader") gets fed up with their group not being able to choose where to eat. They click the "Create" button to make a survey. They input several filters (distance, cuisine, price, ratings, etc) and their location, and this information is sent to a backend Node.js server hosted on Firebase Cloud Functions. There, a request is made to the Yelp Fusion Business Search API endpoint. If the API returns more than 5 restaurants (which pass the group leader's filters), the top 5 restaurants will be stored in the database under a four digit code. If the API doesn't return more than 5 restaurants (which is fairly rare), the group leader will have to broaden their search parameters. Otherwise, they receive the four digit code, which others can use to access a survey. When a group member inputs the four digit code on the website, they'll be taken to a survey page, where they're asked to rate the 5 restaurants on a scale of 1 to 5. Everybody's ratings are averaged and the winning restaurant is selected based on highest average vote. The winning restaurant, the people who have completed the survey, and other interesting information can be found on the results page, which people can access with the code or after they complete the survey. Since data is stored in a Firebase Realtime Database, whenever additional surveys are completed, results automatically update without the need to refresh the page. 

# Languages
This app was made possible with HTML, CSS, JS, and React. It's hosted on Google's Firebase and uses the Realtime Database to provide instant updates whenever another person fills out the survey. 
