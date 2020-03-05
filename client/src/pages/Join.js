import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import database from "../utils/firebase.js";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CodeInput from "../components/CodeInput";

/**Join page. */
class Join extends Component {
  /**
   * Constructor.
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      code: { 0: "", 1: "", 2: "", 3: "" },
      refs: {
        0: React.createRef(),
        1: React.createRef(),
        2: React.createRef(),
        3: React.createRef()
      },
      validCode: false,
      existsError: false,
      readonly: false
    };
  }

  /** Puts focus on first input box */
  componentDidMount() {
    this.state.refs[0].current.getInnerRef().focus();
  }

  /**
   * Called when user enters a valid input.
   * @param {React.SyntheticEvent} e
   * @param {number} id: The input that changed (inputs are 0-indexed)
   */
  async handleChange(e, id) {
    let updatedCode = this.state.code;
    updatedCode[id] = e.target.value;
    this.setState({ code: updatedCode, existsError: false });
    if (e.target.value === "") {
      //implement backspace functionality
      //(id > 0) && this.state.refs["input" + (id-1)].getInnerRef().focus();
    } else {
      id < Object.keys(this.state.refs).length - 1 &&
        this.state.refs[id+1].current.getInnerRef().focus();
    }

    let code = "";
    for (const c in this.state.code) {
      code += this.state.code[c];
    }
    if (code.length === 4) {
      const exists = await this.codeExists(code);
      if (exists) {
        this.setState({ validCode: exists, readonly: true });
        this.props.setCode(code);
      } else {
        const blankCode = { 0: "", 1: "", 2: "", 3: "" };
        this.setState({ code: blankCode, existsError: true });
        this.state.refs[0].current.getInnerRef().focus();
      }
    }
  }

  /**
   * Determines if the input code is in the database.
   *
   * @param {string} code The string representation of the input code.
   * @return true if the input code is in the database, false otherwise.
   */
  async codeExists(code) {
    const exists = await database
      .ref()
      .once("value")
      .then(function(snapshot) {
        return snapshot.child(code).exists();
      });
    return exists;
  }

  /**
   * Renders components.
   */
  render() {
    const button = {
      borderRadius: "6px",
      border: "none",
      color: "#EAE7DC",
      height: "2em",
      fontSize: "calc(10px + 2.5vmin)",
      padding: "0 1rem 0 rem",
      backgroundColor: "#e35417",
      width: "90%",
      margin: "1rem"
    };

    return (
      <div className="mx-2 mt-5" style={{ height: "100%", width: "100%" }}>
        <div style={{ height: "40%", padding: "5% 0 5% 0 " }}>
          <p className="mx-4 mb-4">
            Enter the survey's four-digit code below and make your voice
            heard...or sneakily see what everybody else is thinking.
          </p>
          <div>
            {[0, 1, 2, 3].map(index => (
              <CodeInput
                key={index}
                index={index}
                ref={this.state.refs[index]}
                handleChange={this.handleChange}
                value={this.state.code[index]}
                readonly={this.state.readonly}
              />
            ))}
          </div>
          {this.state.existsError && (
            <p style={{ color: "#bb0000" }}>Invalid code. Try again?</p>
          )}
          {this.state.validCode && (
            <p style={{ color: "#007f00", fontSize: "2em" }}>✔ Success!</p>
          )}
        </div>

        <Container>
          <Row>
            <Col lg={true}>
              <Link to="/survey">
                <button style={button} disabled={!this.state.validCode}>
                  Take survey
                </button>
              </Link>
            </Col>
            <Col lg={true}>
              <Link to="/results">
                <button disabled={!this.state.validCode} style={button}>
                  See results
                </button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Join.propTypes = {
  setCode: PropTypes.func
};

export default Join;
