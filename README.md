<p align="center"><img src="./client/public/bestaurant_logo.jpg" width=800px/></p>

<h1 align="center">Bestaurant</h1>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#project-design-and-organization">Project Design</a> •
  <a href="#building-the-project">Building the project</a> 
</p>

<p align="center">A React App to help you and a group of people decide where to eat.</p>
<p align="center"> Try it out <a href="https://bestaurant.masonzee.com">here</a>! </p>

## Introduction 
Need help deciding where you and your group are going to eat?
Bestaurant has got you covered. As the group leader, click Create and choose a bunch of filters (distance, price, cuisine, &amp; much more!). Our nifty algorithm will generate 5 potential spots for y'all along with a code to a survey. Share the code with everyone so they can rate the restaurants on a scale of 1 to 5, and you'll quickly see what the best restaurant for your party is. The days of indecision are over!

### A bit more detailed
1. A person ("group leader") gets fed up with their group not being able to choose where to eat. They click the "Create" button to make a survey. 
2. They input several filters (distance, cuisine, price, ratings, etc) and their location, and this information is sent to a backend Node.js server hosted on Firebase Cloud Functions. There, a request is made to the Yelp Fusion Business Search API endpoint. 
3. If the API returns more than 5 restaurants (which pass the group leader's filters), the top 5 restaurants will be stored in the database under a four digit code. If the API doesn't return more than 5 restaurants (which is fairly rare), the group leader will have to broaden their search parameters. Otherwise, they receive the four digit code, which others can use to access a survey. 
4. When a group member inputs the four digit code on the website, they'll be taken to a survey page, where they're asked to rate the 5 restaurants on a scale of 1 to 5. Everybody's ratings are averaged and the winning restaurant is selected based on highest average vote. 
5. After taking the survey, you're taken to the results page, which shows the winning restaurant and the people who have completed the survey. You can also view the results by entering the code and clicking on the Results button. Since data is stored in a Firebase Realtime Database, whenever additional surveys are completed, results automatically update without the need to refresh the page. 

## Technologies
- React
- Firebase (Hosting, Realtime Database)

## Key Features
- Queries the Yelp API using the parameters set by the group leader to find five candidate restaurants
- Creates a survey from the five restaurants that users can access with a generated code
- Aggregates and averages user ratings for the five restaurants to determine the winning restaurant
- Results update in realtime, without the need to refresh the page

## Project Design and Organization
Nothing too special. We have the website in the `client` directory and the server file in the `server` directory. 

## Building the Project
Just use `npm run build` while in the `client` directory to build the React app!
