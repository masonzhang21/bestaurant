import React, { Component } from "react";
import PropTypes from "prop-types";
import Map from "./Map";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import ImageCarousel from "./ImageCarousel";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "./Button";

/**Displays a restaurant's information. */
export class Tile extends Component {
  /**
   * Constructor.
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.top = React.createRef();
    this.state = {
      showMap: false,
      showPictures: false
    };
  }

  /**
   * If new restaurant data is sent, scroll to top.
   * @param {Object} prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.top.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  /**
   * Table displaying the hours a restaurant is open.
   */
  HoursComponent = () => {
    if (!this.props.data.hours) {
      //no hours data
      return <p>(No hours data)</p>;
    }
    const hours = this.props.data.hours[0].open;
    const dayMap = {
      0: "Monday",
      1: "Tuesday",
      2: "Wednesday",
      3: "Thursday",
      4: "Friday",
      5: "Saturday",
      6: "Sunday"
    };

    const formattedHours = {
      Monday: { open: [], close: [] },
      Tuesday: { open: [], close: [] },
      Wednesday: { open: [], close: [] },
      Thursday: { open: [], close: [] },
      Friday: { open: [], close: [] },
      Saturday: { open: [], close: [] },
      Sunday: { open: [], close: [] }
    };

    //turns 24hour time string (ex: 2300) to 12hr time string (ex: 11:30am)
    for (const hour of hours) {
      const day = dayMap[hour.day];
      let startTime = (((parseInt(hour.start) + 1100) % 1200) + 100)
        .toString()
        .replace(/(.{2})$/, ":$1");
      Math.floor(hour.start / 1200) < 1
        ? (startTime += "am")
        : (startTime += "pm");
      let endTime = (((parseInt(hour.end) + 1100) % 1200) + 100)
        .toString()
        .replace(/(.{2})$/, ":$1");

      Math.floor(hour.end / 1200) < 1 ? (endTime += "am") : (endTime += "pm");
      formattedHours[day].open.push(startTime);
      formattedHours[day].close.push(endTime);
    }

    for (const [key, value] of Object.entries(formattedHours)) {
      if (value.open.length === 0) {
        formattedHours[key].open.push("None");
      }
      if (value.close.length === 0) {
        formattedHours[key].close.push("None");
      }
    }

    

    return (
      <table
        className="table table-striped table-bordered table-sm mt-3 table-responsive-sm"
        style={{
          fontSize: "1rem",
          width: "100%",
          border: "0",
          alignSelf: "center",
          margin: "auto",
          display: "inline-table"
        }}
      >
        <thead className="thead-dark">
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Open</th>
            <th scope="col">Close</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(formattedHours).map((day, i) => {
            return (
              <tr key={i}>
                <th scope="row">{day}</th>
                <td>
                  {formattedHours[day].open.map((openTime, i) => {
                    return <p key={i}>{openTime}</p>;
                  })}
                </td>
                <td>
                  {formattedHours[day].close.map((closeTime, i) => {
                    return <p key={i}>{closeTime}</p>;
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  /**
   * Embedded Google Map with restaurant location plotted.
   */
  MapComponent = () => {
    const mapContainerStyle = {
      margin: "5% 0 0 0",
      width: "100%",
      height: "25rem",
      borderRadius: "3%",
      position: "relative"
    };

    const mapStyle = {
      width: "100%",
      height: "100%",
      borderRadius: "3%"
    };

    const coords = {
      lat: this.props.data.coordinates.latitude,
      lng: this.props.data.coordinates.longitude
    };

    return (
      <div style={mapContainerStyle}>
        <Map
          style={mapStyle}
          initialCenter={coords}
          zoom={15}
          name={this.props.data.name}
        />
      </div>
    );
  };

  /**
   * Image slider.
   */
  CarouselComponent = () => {
    const carouselContainerStyle = {
      margin: "1em 0 0 0",
      width: "100%",
      borderRadius: "3%",
      position: "relative"
    };

    return (
      <div style={carouselContainerStyle}>
        <ImageCarousel images={this.props.data.photos} width={"100%"} />
      </div>
    );
  };

  /**Renders component. */
  render() {
    const ratingsMap = {
      0: "zero",
      1: "one",
      1.5: "onehalf",
      2: "two",
      2.5: "twohalf",
      3: "three",
      3.5: "threehalf",
      4: "four",
      4.5: "fourhalf",
      5: "five"
    };

    const priceMap = {
      $: "under 10",
      $$: "11–30",
      $$$: "31–60",
      $$$$: "61+"
    };

    const container = {
      fontSize: "calc(10px + 2vmin)",
      backgroundColor: "rgb(255, 255, 255, 0.5)",
      height: "60vh",
      minWidth: "50vw",
      borderRadius: "5%",
      border: "1px black solid"
    };

    const label = {
      fontSize: "calc(0.7em + 0.2vmin)",
      margin: "0 0 10px 0"
    };

    const labelCol = { padding: "0 1em 0 0", textAlign: "left" };

    const text = {
      fontSize: "calc(1rem + 0.5vmin)",
      margin: "0"
    };

    const buttons = {
      borderRadius: "0.5em",
      backgroundColor: "#e35417",
      border: "none",
      color: "#EAE7DC",
      padding: "1rem 0.5rem 1rem 0.5rem",
      width: "100%",
      height: "2rem",
      lineHeight: "normal",
      fontSize: "calc(0.5rem + 1vmin)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    };

    return (
      <SimpleBar style={{ ...container, ...this.props.style }} autoHide={false}>
        <div ref={this.top}></div>
        <div className="mx-3 my-4">
          <h1 style={{ fontSize: "calc(1.2em + 0.5vmin)" }}>
            {this.props.data.name}
          </h1>
          <h2 style={text}>
            {this.props.data.categories
              .map(category => category.title)
              .join(", ")}
          </h2>
          <hr style={{ width: "90%", border: "1px #e35417 solid" }}></hr>
          <Container className="mt-4">
            <Row className="align-items-center">
              <Col md="auto" style={labelCol}>
                <p style={label}>Rating: </p>
              </Col>
              <Col>
                {this.props.data.rating && (
                  <p style={text}>
                    <img
                      src={require(`../images/yelpratings/${
                        ratingsMap[this.props.data.rating]
                      }.png`)}
                      alt=""
                      className="mb-3"
                    ></img>
                    <br />
                    <span style={{ display: "inline-block" }}>
                      {this.props.data.rating} ☆ |{" "}
                      {this.props.data.review_count &&
                        this.props.data.review_count + " "}
                      reviews
                    </span>
                  </p>
                )}
              </Col>
            </Row>
            <hr />
            <Row className="align-items-center">
              <Col md="auto" style={labelCol}>
                <p style={label}>Price:</p>
              </Col>
              <Col>
                <p style={text}>
                  {this.props.data.price} <br />(
                  {this.props.data.price in priceMap
                    ? priceMap[this.props.data.price] + " dollars"
                    : "No price data"}
                  )
                </p>
              </Col>
            </Row>
            <hr />
            <Row className="align-items-center">
              <Col md="auto" style={labelCol}>
                <p style={label}>Distance:</p>
              </Col>
              <Col>
                <p style={text}>
                  {(this.props.data.distance * 0.000621371).toFixed(2) +
                    "mi" +
                    " (" +
                    (this.props.data.distance / 1000).toFixed(2) +
                    "km) from search origin."}
                </p>
              </Col>
            </Row>
            <hr />
            <Row className="align-items-center mb-3">
              <Col md="auto" style={labelCol}>
                <p style={label}>Location:</p>
              </Col>
              <Col>
                <p style={text}>
                  {this.props.data.location.display_address.join(", ")}
                </p>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col>
                <Button
                  style={buttons}
                  message={this.state.showMap ? "Hide Map" : "Show on Map"}
                  onClick={() =>
                    this.setState({ showMap: !this.state.showMap })
                  }
                ></Button>
              </Col>
              <Col>
                <Button
                  style={buttons}
                  message={"Open Google Maps"}
                  onClick={() => {
                    window.open(
                      "https://www.google.com/maps/search/?api=1&query=" +
                        encodeURI(
                          this.props.data.location.display_address.join(", ")
                        )
                    );
                  }}
                ></Button>
              </Col>
            </Row>
            {this.state.showMap && this.MapComponent()}
            <hr />

            <Row className="align-items-center">
              <Col md="auto" className="mr-5" style={labelCol}>
                <p style={label}>Hours:</p>
              </Col>
              <Col>{this.HoursComponent()}</Col>
            </Row>
            <hr />
            <Row className="align-items-center mb-4">
              <Col md="auto" className="mr-5" style={labelCol}>
                <p style={label}>Pictures:</p>
              </Col>
              <Col>
                <Button
                  style={buttons}
                  message={
                    this.state.showPictures ? "Hide Pictures" : "Show Pictures"
                  }
                  onClick={() =>
                    this.setState({ showPictures: !this.state.showPictures })
                  }
                ></Button>
                {this.state.showPictures && this.CarouselComponent()}
              </Col>
            </Row>
            <hr />
            <Row className="align-items-center">
              <Col md="auto" style={labelCol}>
                <p style={label}>Powered by: </p>
              </Col>
              <Col>
                <a
                  href={this.props.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    style={{ borderRadius: "1rem", height: "4rem" }}
                    src={require("../images/yelpLogo.png")}
                    alt="Yelp Logo"
                  ></img>
                </a>
              </Col>
            </Row>
          </Container>
        </div>
      </SimpleBar>
    );
  }
}

Tile.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object
};

export default Tile;
