import React, { Component } from "react";
import PropTypes from "prop-types";
import $ from "jquery";

/**
 * Input fields that takes a single digit as input.
 */
export class CodeInput extends Component {

  /**
   * Constructor.
   * 
   * @param {Object} props 
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Getter for ref.
   */
  getInnerRef = () => this.ref;

  /**
   * Called when user inputs something.
   * @param {SyntheticEvent} e 
   */
  handleChange(e) {
    if (e.target.value.match(/^[0-9]$/) || e.target.value === "") {
      this.props.handleChange(e, this.props.index);
    } else {
      $(this.ref).effect("highlight", { color: "red" }, 150);
    }
  }

  /**Renders the component. */
  render() {
    const style = {
      borderRadius: "4px",
      border: "2px solid red",
      color: "black",
      height: "1.6em",
      textAlign: "center",
      fontSize: "calc(1em + 3vmin)",
      margin: "1.5%",
      width: "17.5%"
    };
    return (
      <input
        style={style}
        onChange={e => this.handleChange(e)}
        maxLength={1}
        ref={r => (this.ref = r)}
        value={this.props.value}
        readOnly={this.props.readonly}
      />
    );
  }
}

CodeInput.propTypes = {
  handleChange: PropTypes.func,
  index: PropTypes.number,
  value: PropTypes.string,
  readonly: PropTypes.bool
}

export default CodeInput;
