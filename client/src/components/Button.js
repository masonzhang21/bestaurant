import React, { Component } from "react";
import PropTypes from "prop-types";

/**A custom button component.*/
export default class Button extends Component {
  /**
   * Constructor.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Called when button is clicked.
   * @param {React.SyntheticEvent} e.
   */
  handleClick(e) {
    this.props.onClick(this.props.message);
  }

  /**
   * Renders components.
   */
  render() {
    return (
      <button
        className={
          this.props.active ? "active " : "inactive " + this.props.class
        }
        onClick={this.handleClick}
        style={this.props.style}
      >
        {this.props.message}
      </button>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]),
  active: PropTypes.bool,
  class: PropTypes.string,
  style: PropTypes.object
};
