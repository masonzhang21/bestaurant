import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Link, Redirect } from "react-router-dom";

/**Success page, shown after successful survey creation. */
export class Success extends Component {
  /**
   * Renders components.
   */
  render() {
    const button = {
      borderRadius: "6px",
      border: "none",
      color: "#EAE7DC",
      height: "80px",
      fontSize: "calc(1.5rem + 2vmin)",
      width: "90%",
      backgroundColor: "#e35417"
    };

    if (this.props.code.length !== 4) {
      return <Redirect to="/" />
    }

    return (
      <div className="mx-5 mt-5">
        <div>
          <h1 style={{ fontSize: "3em" }}>Success!</h1>
          <p style={{ fontSize: "6em" }}>{this.props.code}</p>
          <p className="mx-3 mb-4">
            Share this four-digit code with others so they can fill out the
            survey. Remember to remember it before leaving this page, lest it be
            lost forever!
          </p>
          <Link to="/survey">
            <button style={button}>Go to survey</button>
          </Link>
        </div>
      </div>
    );
  }
}

Success.propTypes = {
  code: PropTypes.string
}

export default Success;
