import React, { Component } from "react";
import PropTypes from "prop-types";
import $ from "jquery";
import "jquery-ui-bundle";
import "jquery-ui-bundle/jquery-ui.css";

/**
 * A custom text input field.
 */
export class TextInput extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = { value: "" };
  }

  /**
   * Called when the input box is clicked.
   * @param {SyntheticEvent} e 
   */
  handleClick(e) {
    this.props.onClick(e);
  }

  /**
   * Called when the user enters something in the input box.
   * @param {SyntheticEvent} e 
   */
  handleChange(e) {
    if (this.props.validInput(e.target.value)) {
      this.props.onChange(e);
      this.setState({ value: e.target.value });
    } else {
      $(this.myRef.current).effect("highlight", { color: "red" }, 300);
    }
  }
  /**
   * Renders components.
   */
  render() {
    return (
      <input
        style={this.props.style}
        value={this.state.value}
        onClick={this.handleClick}
        onChange={this.handleChange}
        ref={this.myRef}
        placeholder={this.props.placeholder}
        size={this.props.placeholder.length}
        type={this.props.type}
      ></input>
    );
  }
}

TextInput.propTypes = {
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  validInput: PropTypes.func,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  type: PropTypes.string
}

export default TextInput;
