import React, { Component } from "react";
import PropTypes from "prop-types";
import BarLoader from "react-spinners/BarLoader";
import ClipLoader from "react-spinners/ClipLoader";
import { Redirect } from "react-router-dom";
import cuisineMap from "../utils/yelpCuisineMap";
import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import TextInput from "../components/TextInput";

/**Create page */
export class Create extends Component {
  /**
   * Constructor.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.error = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.search = this.search.bind(this);
    this.modifySelected = this.modifySelected.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.state = {
      location: "",
      coords: {},
      distanceUnit: [],
      distance: [],
      cuisine: [],
      ratings: [],
      price: [],
      hours: [],
      sort: [],
      vegetarian: [],
      fastFood: [],
      additionalFilters: [],
      search: [],
      selectLocError: false,
      broadenSearchError: false,
      generalError: false,
      success: false,
      loading: false,
      locationMessage: "Get current location"
    };
  }

  /**
   * Passed to child components to modify the corresponding value in state.
   *
   * @param {string} category - The key
   * @param {*} selected - The value
   */
  modifySelected(category, selected) {
    this.setState({ [category]: selected });
  }

  /**
   * Handles the submission of the form: Determines whether the constraints are
   *  valid and if so redirects user to the Success page.
   */
  handleSubmit() {
    this.setState({
      selectLocError: false,
      broadenSearchError: false,
      generalError: false,
      success: false,
      loading: true
    });

    const noLocationData =
      Object.keys(this.state.coords).length === 0 && this.state.location === "";
    if (noLocationData) {
      this.setState({ selectLocError: true, loading: false }, () =>
        this.error.current.scrollIntoView(false)
      );
      return;
    }

    this.search().then(res => {
      if (res === "broadenSearchError") {
        this.setState({ broadenSearchError: true, loading: false }, () =>
          this.error.current.scrollIntoView(false)
        );
      } else if (res === "generalError") {
        this.setState({ generalError: true, loading: false }, () =>
          this.error.current.scrollIntoView(false)
        );
      } else {
        this.props.setCode(res);
        this.setState({ success: true });
      }
    });
  }

  /**
   * Formats the search constraints in state for the Yelp API.
   *
   * @return {Object} params: The search constraints.
   */
  formatSearch() {
    let params = {};

    // We're guaranteed to have either coords or location or both.
    Object.keys(this.state.coords).length > 0
      ? Object.assign(params, this.state.coords)
      : (params.location = this.state.location[0]);

    //max distance from current location
    if (this.state.distance.includes("Any")) {
      params.radius = 40000;
    } else if (this.state.distanceUnit === "km") {
      params.radius = this.state.distance[0] * 1000;
    } else {
      params.radius = this.state.distance[0] * 1609;
    }

    /* b/c of minor differences in capitalization, etc., 
    our categories don't correspond to the input needed for the Yelp API.
     The imported cuisineMap maps our categories to Yelp categories.*/
    this.state.cuisine.includes("Any")
      ? (params.categories = "restaurants")
      : (params.categories = this.state.cuisine
          .map(cuisine => cuisineMap[cuisine])
          .toString());

    !this.state.ratings.includes("Any") &&
      (params.ratings = this.state.ratings[0]);

    !this.state.price.includes("Any") &&
      (params.price = this.state.price.map(p => p.length).toString());

    if (this.state.hours.length > 0) {
      if (this.state.hours.includes("Now")) {
        params["open_now"] = true;
      } else {
        //assumes search location is in same timezone as where the survey was created.
        const timeMap = {
          "12pm": "12:00",
          "1pm": "13:00",
          "2pm": "14:00",
          "3pm": "15:00",
          "4pm": "16:00",
          "5pm": "17:00",
          "6pm": "18:00",
          "7pm": "19:00",
          "8pm": "20:00",
          "9pm": "21:00",
          "10pm": "22:00",
          "11pm": "23:00",
          "12am": "00:00"
        };
        let inputTime = this.state.hours[0];
        inputTime in timeMap && (inputTime = timeMap[inputTime]);
        const now = new Date();
        const queryDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          inputTime.substring(0, 2),
          inputTime.substring(3)
        );
        const queryTime = Math.floor(queryDate.getTime() / 1000);
        params["open_at"] = queryTime;
      }
    }

    params.sort_by = this.state.sort[0].replace(/ /g, "_").toLowerCase();

    //including vegetarian or vegan overrides all earlier cuisine choices
    if (this.state.vegetarian.includes("Vegetarian")) {
      params.categories = "vegetarian";
    } else if (this.state.vegetarian.includes("Vegan")) {
      params.categories = "vegan";
    }

    //search query term
    if (this.state.fastFood.includes("Fast food")) {
      params.term = "Fast food";
    } else if (this.state.fastFood.includes("Sit down")) {
      params.term = "Sit down";
    } else {
      params.term = "Restaurant";
    }

    params.attributes = this.state.additionalFilters
      .map(filter => filter.replace(/ /g, "_").toLowerCase())
      .toString();

    return params;
  }

  /**
   * Formats the search constraints stored in state and then makes a request to the backend API.
   *
   * @return {Promise<string>} A string containing the code for the survey (if successful) or an error message.
   */
  search() {
    const API_URL =
      "https://us-central1-consensus-9226f.cloudfunctions.net/widgets/create";
    const params = this.formatSearch();

    //catch block seems to always execute even though fetch is fine?
    return fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(params)
    })
      .then(res => {
        return res.json();
      })
      .catch("Error: Something went wrong.");
  }

  /**
   * Gets user's current location using HTML5 Geolocation.
   */
  getLocation() {
    this.setState({
      locationMessage: <ClipLoader size={28} color={"#EAE7DC"} />
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(loc =>
        this.setState({
          coords: {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
          },
          locationMessage: "✔ Success!"
        })
      );
    } else {
      this.setState({ locationMessage: "Geolocation is not available." });
      window.alert("Error: Geolocation not available.");
    }
  }

  /**
   * Renders components.
   */
  render() {
    const offwhite = "#EAE7DC";
    const orange = "#e35417";

    const container = {
      fontSize: "calc(10px + 2vmin)",
      height: "100%",
      width: "50rem",
      maxWidth: "100vw",
      borderRadius: "2%",
      margin: "3vh 0 0 0"
    };

    const buttons = {
      borderRadius: "4px",
      border: "none",
      color: offwhite,
      height: "3rem",
      fontSize: "calc(0.9rem + 1vmin)",
      margin: "6px",
      padding: "0px 10px 0px 10px",
      minWidth: "3rem"
    };

    const submitButton = {
      borderRadius: "10px",
      border: "none",
      color: offwhite,
      height: "6rem",
      textAlign: "center",
      fontSize: "calc(2rem + 3vmin)",
      margin: "0px 0px 0px 0px",
      padding: "0px 10px 0px 10px",
      width: "70%"
    };

    const inputStyle = {
      borderRadius: "4px",
      border: "2px solid red",
      color: "black",
      height: "3rem",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "calc(0.9rem + 1vmin)",
      margin: "6px"
    };

    const centerItems = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    };

    const category = {
      display: "block",
      margin: "2.75em 1em 0 1em",
      ...centerItems
    };

    const info = {
      display: "block",
      fontSize: "calc(0.9rem + 0.5vmin)",
      margin: "0.5em 0 0 0"
    };

    const categoryLine = {
      width: "70%"
    };

    const surveyBoundsLine = {
      width: "90%",
      border: "2px #940d0d solid",
      borderRadius: "0px"
    };

    return (
      <div style={{ ...container, ...centerItems }}>
        <div className="mb-3 mx-3">
          <h1 style={{fontSize: "calc(2rem + 2vmin)"}}>Survey says...</h1>
          <h2 className="mt-3" style={{ fontSize: "calc(1rem + 0.7vmin)", lineHeight: 1.4}}>
            Customize your potential restaurant matches by applying filters
            below! The only required field is Location. If you don't pick anything, it'll default to the maroon option.
          </h2>
          <hr style={surveyBoundsLine}></hr>


        </div>

        <div className="mx-3" style={centerItems}>
          <h2>
            <span className="mr-1" style={{ color: "#bb0000" }}>
              *
            </span>
            Location
          </h2>
          <h3 style={info}>
            Use your current location or enter one in the field below! Valid
            addresses include "NYC", "350 5th Ave, New York, NY 10118", and "New
            York City" (we're not picky).
          </h3>
          <hr style={categoryLine} />
          <Button
            message={this.state.locationMessage}
            style={{ ...buttons, width: "90%", margin: "0", ...centerItems }}
            active={Object.keys(this.state.coords).length > 0}
            onClick={this.getLocation}
          ></Button>
          <p
            className="my-1"
            style={{
              margin: "0",
              fontSize: "calc(1rem + 1.5vmin)",
              color: orange
            }}
          >
            or
          </p>
          <TextInput
            style={{ ...inputStyle, width: "90%", margin: "0" }}
            onClick={e =>
              this.setState({
                coords: {},
                locationMessage: "Get current location"
              })
            }
            onChange={e => this.modifySelected("location", [e.target.value])}
            validInput={input => true}
            placeholder={"Address"}
          />
        </div>
        <div style={category}>
          <h2>Distance</h2>
          <h3 style={info}>
            Grab a unit of measurement and a number (or enter your own)!
          </h3>
          <hr style={categoryLine}></hr>
          <ButtonGroup
            items={["km"]}
            style={buttons}
            multSelect={false}
            default={"mi"}
            selected={this.state.distanceUnit}
            category={"distanceUnit"}
            modifySelected={this.modifySelected}
            hasTextInput={false}
          />
          <ButtonGroup
            items={[0.5, 1, 1.5, 2, 5, 25]}
            style={buttons}
            multSelect={false}
            default={"Any"}
            selected={this.state.distance}
            category={"distance"}
            modifySelected={this.modifySelected}
            hasTextInput={true}
            inputStyle={inputStyle}
            placeholderInput={"ex: 0.2"}
            validInput={input =>
              input === "" ||
              input === "." ||
              (Math.floor(Number(input) >= 0) &&
                Number(input) * 10 === parseInt(Number(input) * 10) &&
                Number(input) <= 25)
            }
          />
        </div>
        <div style={category}>
          <h2>Cuisine</h2>
          <h3 style={info}>
            Oooh... so many options! Good thing you can pick as many as you
            want!
          </h3>
          <hr style={categoryLine}></hr>
          <ButtonGroup
            items={[
              "African",
              "New American",
              "BBQ",
              "British",
              "Buffets",
              "Breakfast",
              "Cafes",
              "Burgers",
              "Chinese",
              "French",
              "German",
              "Hot pot",
              "Indian",
              "Italian",
              "Japanese",
              "Korean",
              "Mexican",
              "Noodles",
              "Asian",
              "Pizza",
              "Salad",
              "Sandwiches",
              "Seafood",
              "Southern",
              "Spanish",
              "Steak",
              "Sushi",
              "Thai",
              "Vietnamese"
            ]}
            style={buttons}
            multSelect={true}
            default={"Any"}
            selected={this.state.cuisine}
            category={"cuisine"}
            modifySelected={this.modifySelected}
          />
        </div>

        <div style={category}>
          <h2>Rating</h2>
          <h3 style={info}>Is it elitist to choose 5? Probably...</h3>
          <hr style={categoryLine}></hr>
          <ButtonGroup
            items={["3+", "3.5+", "4+", "4.5+", "5"]}
            style={buttons}
            multSelect={false}
            default={"Any"}
            selected={this.state.ratings}
            category={"ratings"}
            modifySelected={this.modifySelected}
            hasTextInput={true}
            inputStyle={inputStyle}
            placeholderInput={"ex: 3.7"}
            validInput={input =>
              input === "" ||
              input === "." ||
              (Math.floor(Number(input) >= 0) &&
                Number(input) * 10 === parseInt(Number(input) * 10) &&
                Number(input) <= 5)
            }
          />
        </div>
        <div style={category}>
          <h2>Price</h2>
          <h3 style={info}>How much moola do you got?</h3>
          <hr style={categoryLine}></hr>
          <ButtonGroup
            items={["$", "$$", "$$$", "$$$$"]}
            style={buttons}
            multSelect={true}
            default={"Any"}
            selected={this.state.price}
            category={"price"}
            modifySelected={this.modifySelected}
            hasTextInput={false}
          />
        </div>
        <div style={category}>
          <h2>Open At</h2>
          <h3 style={info}>
            If you need to eat now, or if you have a time in
            mind, click something below! Feel free to input a time yourself as
            well.
          </h3>
          <hr style={categoryLine}></hr>
          <ButtonGroup
            items={["Now", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"]}
            style={buttons}
            multSelect={false}
            default={""}
            selected={this.state.hours}
            category={"hours"}
            modifySelected={this.modifySelected}
            hasTextInput={true}
            inputStyle={inputStyle}
            placeholderInput={"ex: 10:30pm"}
            validInput={input => true}
            inputType={"time"}
          />
        </div>
        <div style={category}>
          <h2>Sort by</h2>
          <h3 style={info}>What's most important to you?</h3>
          <hr style={categoryLine}></hr>
          <ButtonGroup
            items={["Rating", "Review Count", "Distance"]}
            style={buttons}
            multSelect={false}
            default={"Best match"}
            selected={this.state.sort}
            category={"sort"}
            modifySelected={this.modifySelected}
            hasTextInput={false}
          />
        </div>
        <div style={category}>
          <h2>Additional Filters</h2>
          <h3 style={info}>Anything catch your eye?</h3>
          <hr style={categoryLine}></hr>
          <ButtonGroup
            items={["Vegetarian", "Vegan"]}
            style={buttons}
            multSelect={false}
            default={""}
            selected={this.state.vegetarian}
            category={"vegetarian"}
            modifySelected={this.modifySelected}
            hasTextInput={false}
          />
          <ButtonGroup
            items={["Fast food", "Sit down"]}
            style={buttons}
            multSelect={false}
            default={""}
            selected={this.state.fastFood}
            category={"fastFood"}
            modifySelected={this.modifySelected}
            hasTextInput={false}
          />
          <ButtonGroup
            items={[
              "Hot and New",
              "Gender Neutral Bathrooms",
              "Open To All",
              "Wheelchair Accessible"
            ]}
            style={buttons}
            multSelect={true}
            default={""}
            selected={this.state.additionalFilters}
            category={"additionalFilters"}
            modifySelected={this.modifySelected}
            hasTextInput={false}
          />
        </div>
        <div style={category}>
          <h2>Search With</h2>
          <h3 style={info}>We'll be supporting Google Search soon!</h3>
          <hr style={categoryLine}></hr>
          <ButtonGroup
            items={[]}
            style={buttons}
            multSelect={false}
            default={"Yelp"}
            selected={this.state.search}
            category={"search"}
            modifySelected={this.modifySelected}
            hasTextInput={false}
          />
        </div>
        <div style={{ ...centerItems, margin: "1rem 0 0 0", width: "100%" }}>
        <hr className="my-5" style={surveyBoundsLine}></hr>
          {this.state.loading ? (
            <BarLoader
              height={"80px"}
              width={"70%"}
              css={"border-radius: 0.8em;"}
              color={orange}
            />
          ) : (
            <Button
              message={"Submit"}
              style={submitButton}
              active={false}
              onClick={this.handleSubmit}
            />
          )}
        </div>
        <div ref={this.error} style={{ color: "#bb0000" }}>
          <p>
            {this.state.selectLocError && "*Select a location"}
            {this.state.generalError &&
              "*Sorry, something strange happened. Maybe the location address isn't valid?"}
            {this.state.broadenSearchError &&
              "*Your filters were too strong, and we couldn't find anything! Try being less picky?"}
          </p>
        </div>
        {this.state.success && <Redirect to="/success" />}
      </div>
    );
  }
}

Create.propTypes = {
  setState: PropTypes.func
}

export default Create;
