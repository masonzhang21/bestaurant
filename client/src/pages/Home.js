import React, { Component } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PacmanLoader from "react-spinners/PacmanLoader";

/**
 * Home page.
 */
class Home extends Component {

  /**
   * Constructor.
   * @param {Object} props 
   */
  constructor(props) {
    super(props);

    this.people = ["friends", "family", "partner", "group"];
    this.state = {
      wordIndex: 0
    };
  }

  /**Loops words in people every two seconds. */
  componentDidMount() {
    this.wordLoop = setInterval(() => {
      let nextIndex = (this.state.wordIndex + 1) % this.people.length;
      this.setState({ wordIndex: nextIndex });
    }, 2000);
  }

  /**Clears word loop interval. */
  componentWillUnmount() {
    clearInterval(this.wordLoop);
  }

  /**
   * Renders components.
   *
   */
  render() {
    const header = {
      fontWeight: 800,
      fontSize: "calc(2.5em + 2.5vmin)",
      color: "#e35417",
      margin: "0 0 2vh 0"
    };
    const subHeader = {
      margin: "0 10vw 0 10vw",
      fontSize: "calc(0.9rem + 1vmin)"
    };
    const buttons = {
      borderRadius: "1rem",
      backgroundColor: "#e35417",
      border: "none",
      color: "#EAE7DC",
      padding: "5%",
      width: "100%",
      height: "5rem",
      fontSize: "calc(2rem + 1.5vmin)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    };

    return (
      <div>
        <div>
          <h1 style={header}>Bestaurant</h1>
          <p style={subHeader}>
            Need help deciding where you and your{" "}
            <span style={{ color: "#e35417" }}>
              {this.people[this.state.wordIndex]}
            </span>{" "}
            are going to eat? From
            <span style={{ color: "#e35417" }}>
              {" "}
              "I don't really care"
            </span> to{" "}
            <span style={{ color: "#e35417" }}>
              "let's eat vegetarian today"
            </span>
            {", "}<span style={{ color: "#e35417" }}>Bestaurant </span> has got you
            covered. Click create and choose a bunch of filters (price,
            location, cuisine, & much more!). Our nifty algorithm will
            generate <span style={{ color: "#e35417" }}>5 amazing matches </span> for y'all along with a code to a survey.
            Share the code with everyone so they can rate the restaurants on a
            scale of 1 to 5, and you'll quickly see what the <span style={{ color: "#e35417" }}>best restaurant </span> for
            your party is. The days of indecision are over!
          </p>
        </div>

        <Container className="mt-5">
          <Row className="mb-5">
            <Col>
              <PacmanLoader
                size={"8vmax"}
                color={"#e35417"}
                css={{ margin: "0 0 8vmax 25vw" }}
              />
            </Col>
          </Row>
          <Row className="align-items-end">
            <Col className="mb-5" lg={true}>
              <p style={{ fontSize: "calc(1rem + 0.8vmin)" }} className="mb-3">
                Poll your people, leader!
              </p>
              <div>
                <Link to="/create">
                  <Button
                    style={buttons}
                    className="mt-5"
                    message="Create"
                    onClick={e => e}
                  />
                </Link>
              </div>
            </Col>

            <Col className="mb-5" lg={true}>
              <p style={{ fontSize: "calc(1rem + 0.8vmin)" }} className="mb-3">
                Take the survey, people!
              </p>
              <div>
                <Link to="/join">
                  <Button
                    style={buttons}
                    className="mt-5"
                    message="Join"
                    onClick={e => e}
                  />
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
