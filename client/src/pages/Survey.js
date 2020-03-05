import React, { Component } from "react";
import PropTypes from "prop-types";
import Ratings from "react-ratings-declarative";
import { v4 as uuidv4 } from "uuid";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, Redirect } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import Tile from "../components/Tile";
import database from "../utils/firebase.js";

/**Survey page. */
export class Survey extends Component {
  /**
   * Constructor.
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.handleRating = this.handleRating.bind(this);
    this.recordSurvey = this.recordSurvey.bind(this);
    this.rating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.restaurants = {};
    this.state = {
      loading: true,
      redirect: false,
      done: false,
      currentTile: 1,
      name: ""
    };
  }

  //tiles and ratings are indexed 1 thru 5
  /**
   * Called when user clicks on a star rating.
   * Tiles and ratings are indexed 1 thru 5, while entries in the database are 0-indexed.
   * @param {number} rating
   */
  handleRating(rating) {
    this.rating[this.state.currentTile] = rating;
    if (this.state.currentTile === 5) {
      this.setState({ done: true });
    } else {
      this.setState({ currentTile: this.state.currentTile + 1 });
    }
  }

  /**Checks if initialization of restaurants was successful and if not, redirects user to join page.*/
  async componentDidMount() {
    if (this.props.code.length !== 4) {
      this.setState({ redirect: true });
      return;
    }
    let restaurants = await this.getRestaurants();
    if (!restaurants) {
      //restaurants is undefined/empty. This redirect is a workaround for when the user clicks from
      //"create" to "go to survey" too quickly on the /success page, before database data has been loaded yet.
      this.setState({ redirect: true });
      return;
    }
    this.restaurants = restaurants;
    if (Object.keys(this.restaurants).length !== 0) {
      this.setState({ loading: false });
    } else {
      this.setState({ redirect: true });
    }
  }

  /**
   * Checks if the code is valid and if so, returns an object containing restaurant data.
   *
   * @return {Object} restaurant data..
   */
  async getRestaurants() {
    return await database
      .ref()
      .once("value")
      .then(snapshot => {
        if (snapshot.child(this.props.code).exists()) {
          return snapshot
            .child(this.props.code)
            .child("restaurants")
            .val();
        }
      })
      .catch("Error.");
  }

  /**Writes to database the results of the survey. */
  recordSurvey() {
    const survey = {
      name: this.state.name,
      ...this.rating
    };
    database.ref(this.props.code + "/surveys").update({
      [uuidv4()]: survey
    });
  }

  /**
   * Component representing a tile and a rating input.
   */
  TileRating = props => {
    if (this.state.done || this.state.loading) {
      return null;
    }

    const restaurantId = Object.keys(this.restaurants)[
      this.state.currentTile - 1
    ];
    const currentRestaurant = this.restaurants[restaurantId];

    return (
      <div className={"mb-3"}>
        <Tile id={this.state.currentTile} data={currentRestaurant} />
        <div className={"my-3"}>
          <Ratings
            rating={this.state.rating}
            changeRating={this.handleRating}
            widgetEmptyColors={"#707070"}
            widgetRatedColors={"#e35417"}
            //widgetDimensions={""}
          >
            <Ratings.Widget />
            <Ratings.Widget />
            <Ratings.Widget />
            <Ratings.Widget />
            <Ratings.Widget />
          </Ratings>
          <p className="mt-3">{this.state.currentTile + " of 5"}</p>
        </div>
      </div>
    );
  };

  /**Component rendered when survey is completed. */
  DoneComponent = props => {
    const button = {
      color: "#EAE7DC",
      borderRadius: "5px",
      border: "none",
      margin: "1rem",
      minHeight: "4rem",
      textAlign: "center",
      fontSize: "calc(1rem + 0.5vmin)",
      width: "100%",
      minWidth: "3rem"
    };
    const input = {
      borderRadius: "5px",
      border: "1px red solid",
      margin: "1rem",
      minHeight: "4rem",
      textAlign: "center",
      fontSize: "calc(1rem + 0.5vmin)",
      width: "100%",
      minWidth: "3rem"
    };
    const centerItems = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    };

    return (
      <div className={"mx-3 my-3"}>
        <div className="mt-3">
          <h1 style={{ fontSize: "calc(2.5rem + 0.7vmin)", fontWeight: "800" }}>
            {"Survey: " + this.props.code}
          </h1>
        </div>
        <div style={{ ...centerItems, height: "50vh" }}>
          <Container>
            <Row className="align-items-center">
              <Col lg={true}>
                <TextInput
                  style={input}
                  onClick={() => {}}
                  onChange={e => {
                    this.setState({ name: e.target.value });
                  }}
                  validInput={() => true}
                  placeholder={"name (optional)"}
                  type={"text"}
                />
              </Col>
              <Col lg={true}>
                <Link to="/results">
                  <Button
                    onClick={this.recordSurvey}
                    message={"Submit and See Results!"}
                    style={button}
                  />
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
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

    if (this.state.loading) {
      return (
        <BarLoader width={"100%"} height={10} loading={this.state.loading} />
      );
    }

    if (this.state.done) {
      return <this.DoneComponent />;
    }

    return (
      <div className={"mx-3 my-3"}>
        <div className="mt-3">
          <h1 style={{ fontSize: "calc(2.5rem + 0.7vmin)", fontWeight: "800" }}>
            {"Survey: " + this.props.code}
          </h1>
          <h2 className={"my-3"} style={{ fontSize: "calc(0.6rem + 1.5vmin)" }}>
            Rate these restaurants out of 5 stars:
          </h2>
        </div>
        <this.TileRating />
      </div>
    );
  }
}

Survey.propTypes = {
  code: PropTypes.string
};

export default Survey;
