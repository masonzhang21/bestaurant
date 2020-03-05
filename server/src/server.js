const database = require("./firebase");
const yelp = require("./yelp");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log(`Listening to ${PORT}`);
});

app.get("/", (req, res) => res.json("All systems online!"));
app.post("/create", (req, res) => processCreate(req, res));

/**
 * Called when a Create Form is submitted. The method queries
 *  the Yelp Fusion API and returns a string containing a code
 * if successful, and an error message if not.
 *
 * @param {*} req
 * @param {*} res
 */
async function processCreate(req, res) {
  let params = req.body;
  let results = await searchYelp(params);
  if ("error" in results) {
    return res.json("generalError");
  }

  let restaurants = results.businesses;
  "rating" in params &&
    restaurants.filter(restaurant => {
      restaurant.rating >= params.rating;
    });

  //user's filters were too narrow
  if (restaurants.length < 5) {
    return res.json("broadenSearchError");
  } else if (restaurants.length > 15) {
    //grab top 15 restaurants and then randomize a bit.
    restaurants = restaurants.slice(0, 20);
    console.log(restaurants)
    restaurants.sort(() => 0.5 - Math.random());
    console.log(restaurants)
  }

  let code = "";
  //chooses a code that's not in the database or was generated 24+ hours ago by blindly guessing and checking codes.
  while (code === "") {
    let rand =
      Math.floor(Math.random() * 10).toString() +
      Math.floor(Math.random() * 10).toString() +
      Math.floor(Math.random() * 10).toString() +
      Math.floor(Math.random() * 10).toString();
    await database
      .db()
      .ref()
      .once("value")
      .then(function(snapshot) {
        if (
          !snapshot.child(rand).exists() ||
          Date.now() - snapshot.child("timestamp").val() > 24 * 60 * 60 * 1000
        ) {
          //definitely not the best way to delete old codes or generate new codes. change later.
          code = rand;
        }
      });
  }
  database
    .db()
    .ref(code)
    .set({
      location:
        "location" in params
          ? params.location
          : { latitude: params.latitude, longitude: params.longitude },
      timestamp: Date.now(),
      restaurants: {},
      surveys: {}
    });

  // Get sub-array of first 5 restaurants.
  let chosenFive = restaurants.slice(0, 5);
  console.log(chosenFive)
  //adds each restaurant to database
  chosenFive.forEach(async restaurant => {
    let id = restaurant.id;
    let details = await restaurantDetails(id);
    if ("error" in details) {
      res.json("generalError");
    }
    details.distance = restaurant.distance;
    database
      .db()
      .ref(code + "/restaurants")
      .update({
        [id]: details
      });
  });

  res.json(code);
}

/**
 * Makes a call to the Business Details endpoint of the Yelp Fusion API for data about a specific restaurant.
 * @param {String} id The Yelp ID of the restaurant to get data for.
 * @return {Object} Contains an error message if the GET request faileed, and restaurant data otherwise.
 */
async function restaurantDetails(id) {
  try {
    let res = await axios.get("https://api.yelp.com/v3/businesses/" + id, {
      headers: {
        Authorization: `Bearer ${yelp.getKey()}`
      }
    });
    return res.data;
  } catch (err) {
    return { error: "Error: Something went wrong." };
  }
}

/**
 * Makes a call to the Business Search endpoint of the Yelp Fusion API for a list of restaurants that match the user's filters.
 * @param {Object} params The user's inputted parameters/filters for the search.
 * @return {Object} Contains an error message if the GET request faileed, and search data otherwise.

 */
async function searchYelp(params) {
  try {
    let res = await axios.get("https://api.yelp.com/v3/businesses/search", {
      headers: {
        Authorization: `Bearer ${yelp.getKey()}`
      },
      params: params
    });
    return res.data;
  } catch (err) {
    return { error: "Error: Something went wrong." };
  }
}