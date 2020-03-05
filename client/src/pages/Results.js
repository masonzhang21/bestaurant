import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import database from "../utils/firebase.js";
import Tile from "../components/Tile";

/**Results page. */
class Results extends Component {
  /**
   * Constructor.
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      redirect: false,
      noSurveyError: false,
      topchoice: {},
      topchoiceRating: 0,
      numSurveys: 0,
      names: []
    };
  }

  /**
   * Upon loading, fetches restaurant/survey data from database and calculates the most popular restaurant.
   */
  async componentDidMount() {
    if (this.props.code.length < 4) {
      this.setState({ redirect: true });
      return;
    }
    
    await this.getRestaurants();
    if (Object.keys(this.restaurants).length !== 0) {
      //Realtime database: callback function triggers each time a new survey is filled.
      await database.ref(this.props.code).on("value", snapshot => {
        if (snapshot.child("surveys").exists()) {
          const surveys = snapshot.child("surveys").val();
          this.getTopChoice(surveys);
        } else {
          this.setState({ noSurveyError: true });
        }
        this.setState({ loading: false });
      });
    } else {
      this.setState({ redirect: true });
    }
  }

  /**
   * Calculates the winner based on survey data.
   *
   * @param {Object} surveys Survey data containing ratings for each of the 5 restaurants.
   */
  getTopChoice(surveys) {
    //play around with weights on each person's survey? right now 5 + 1 = 3 + 2, but maybe 3 + 2 is better?
    let sum = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let names = [];
    let numSurveys = 0;
    for (let survey in surveys) {
      for (let i = 1; i <= 5; i++) {
        sum[i] = sum[i] + surveys[survey][i];
      }
      names.push(surveys[survey]["name"]);
      numSurveys += 1;
    }

    let winnerIndex = 1;
    for (let i = 1; i <= Object.keys(sum).length; i++) {
      sum[i] > sum[winnerIndex] && (winnerIndex = i);
    }
    //restructure how data is stored in database so the keys are restaurant ids instead of 1/2/3/4/5.
    const winnerId = Object.keys(this.restaurants)[winnerIndex - 1];
    const winnerData = this.restaurants[winnerId];
    const topchoiceRating = sum[winnerIndex] / numSurveys;
    this.setState({
      topchoice: winnerData,
      topchoiceRating: topchoiceRating,
      numSurveys,
      names: names.map(name => (name === "" ? "Anonymous" : name))
    });
  }

  /**
   * Gets restaurants from database.
   */
  async getRestaurants() {
    await database
      .ref(this.props.code)
      .once("value")
      .then(snapshot => {
        if (snapshot.child("restaurants").exists()) {
          this.restaurants = snapshot.child("restaurants").val();
        }
        if (snapshot.child("location").exists()) {
          //maybe integrate current location with Google Maps in the future?
          this.location = snapshot.child("location").val();
        }
      });
  }

  /**
   * Returns the component containing winner information.
   *
   * @return {Component} Winner data.
   */
  WinnerDisplay = () => {
    return (
      <div style={{ maxWidth: "50rem" }}>
        <h2
          className={"my-3 mt-4"}
          style={{ fontSize: "calc(1.5rem + 1.5vmin)" }}
        >
          And the winner is...
        </h2>
        {Object.keys(this.state.topchoice).length !== 0 && (
          <Tile
            data={this.state.topchoice}
            style={{ border: "2px green solid" }}
          />
        )}
        <div className={"my-4"}>
          <p>
            With a{" "}
            <span style={{ color: "#e35417" }}>
              {this.state.topchoiceRating.toFixed(2)}
            </span>{" "}
            average rating across{" "}
            <span style={{ color: "#e35417" }}>{this.state.numSurveys}</span>{" "}
            surveys,{" "}
            <span style={{ color: "#e35417" }}>
              {this.state.topchoice.name}{" "}
            </span>
            has been crowned the victor!
          </p>
        </div>
        <div
          className={"mx-3"}
          style={{ border: "1.5px solid black", borderRadius: "5px" }}
        >
          <p className={"mt-2"} style={{ marginBottom: "0" }}>
            Opinions sourced from:
          </p>
          <hr style={{ width: "80%", marginTop: "0" }}></hr>
          <p style={{ fontSize: "0.7em" }}>{this.state.names.join(", ")}</p>
        </div>
      </div>
    );
  };

  /**
   * Returns the component to render when no surveys have been submitted.
   *
   * @return {Component} Message and button linking to survey
   */
  NoSurveyDisplay = () => {
    const buttons = {
      borderRadius: "1rem",
      backgroundColor: "#e35417",
      border: "none",
      color: "#EAE7DC",
      padding: "5%",
      width: "100%",
      height: "60px",
      fontSize: "calc(30px + 1.5vmin)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    };

    return (
      <div style={{ marginTop: "20%" }}>
        <p className="mb-3">No surveys have been completed. Fill one now!</p>
        <Link to="/survey">
          <button style={buttons}> Survey </button>
        </Link>
      </div>
    );
  };

  /**
   * Renders components.
   */
  render() {
    if (this.state.redirect) {
      return <Redirect to="/join" />;
    }
    return (
      <div className={"mx-3 my-3"}>
        <h1
          className={"mt-3"}
          style={{ fontSize: "calc(2.5rem + 0.7vmin)", fontWeight: "800" }}
        >
          {"Survey: " + this.props.code}
        </h1>
        <div>
          {this.state.noSurveyError && this.NoSurveyDisplay()}
          {!this.state.noSurveyError &&
            !this.state.loading &&
            this.WinnerDisplay()}
        </div>

        <BarLoader width={"100%"} height={10} loading={this.state.loading} />
      </div>
    );
  }
}

Results.propTypes = {
  code: PropTypes.string
};

export default Results;
