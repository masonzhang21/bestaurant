import React, { Component } from "react";
import "./App.css";

import Home from "../pages/Home";
import Join from "../pages/Join";
import Create from "../pages/Create";
import Success from "../pages/Success";
import Survey from "../pages/Survey";
import Results from "../pages/Results";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

/**Root class. */
class App extends Component {
  /**
   * Constructor.
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.setCode = this.setCode.bind(this);
    this.state = {
      code: ""
    };
  }

  /**
   * Sets the code.
   * @param {String} code The code.
   */
  setCode(code) {
    this.setState({ code: code });
  }

  /**
   * Renders components.
   */
  render() {
    return (
      <Router>
        <div style={{ height: "100%" }}>
          <nav
            className="navbar navbar-light"
            style={{
              backgroundColor: "#ed6663",
              height: "3rem"
            }}
          >
            <img src={require("../images/plate_white.png")} alt="" width="2rem"/> 
            <Link
              className="mr-3"
              to="/"
              style={{
                color: "#EAE7DC",
                fontSize: "1.3em",
                lineHeight: "normal"
              }}
            >
              Home
            </Link>
          </nav>
          <div className="App" style={{ minHeight: "calc(100% - 3rem)" }}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/create">
                <Create setCode={this.setCode} />
              </Route>
              <Route path="/join">
                <Join setCode={this.setCode} />
              </Route>
              <Route path="/success">
                <Success code={this.state.code} />
              </Route>
              <Route path="/survey">
                <Survey code={this.state.code} />
              </Route>
              <Route path="/results">
                <Results code={this.state.code} />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
