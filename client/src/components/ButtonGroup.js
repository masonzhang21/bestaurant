import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import TextInput from "./TextInput";

/**A collection of buttons and inputs. Default button and input are optional.*/
export class ButtonGroup extends Component {
  /**
   * Constructor.
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
  }

  /**
   * Sets default item.
   */
  componentDidMount() {
    if (this.props.default) {
      this.props.modifySelected(this.props.category, [this.props.default]);
    }
  }

  /**
   * Called when a button is clicked.
   * @param {string} label The name of the button pressed.
   */
  handleButtonClick(label) {
    if (this.props.multSelect) {
      //1+ buttons can be selected
      if (label === this.props.default) {
        // if the default button (ex: Any) is clicked, unselect everything except Any.
        this.props.modifySelected(this.props.category, [label]);
      } else if (this.props.selected.includes(label)) {
        //if an active button is clicked and there's a default:
        if (this.props.selected.length === 1 && this.props.default !== "") {
          //if last item, refocus on default.
          this.props.modifySelected(this.props.category, [this.props.default]);
        } else {
          //if there's still another item or there's no default, remove it from list.
          this.props.modifySelected(
            this.props.category,
            [...this.props.selected].filter(item => item !== label)
          );
        }
      } else {
        //if an inactive button is clicked, add to list and remove the default button
        this.props.modifySelected(
          this.props.category,
          [...this.props.selected, label].filter(
            item => item !== this.props.default
          )
        );
      }
    } else {
      //1 button can be selected
      this.props.selected.includes(label)
        ? this.props.modifySelected(this.props.category, [this.props.default])
        : this.props.modifySelected(this.props.category, [label]);
    }
  }

  /**
   * Called when the user enters a valid input in the input box.
   * @param {SyntheticEvent} e
   */
  handleInputChange(e) {
    const input = e.target.value;
    this.props.modifySelected(this.props.category, [input]);
  }

  /**
   * Called when the user clicks on the input box.
   * @param {SyntheticEvent} e
   */
  handleInputClick(e) {
    //This isn't necessary
    this.props.modifySelected(this.props.category, []);
  }

  /**
   * Renders components.
   */
  render() {
    return (
      <div>
        {this.props.default && (
          <Button
            message={this.props.default}
            style={this.props.style}
            active={this.props.selected.includes(this.props.default)}
            onClick={this.handleButtonClick}
          />
        )}
        {this.props.items.map((item, i) => (
          <Button
            key={item}
            message={item}
            style={this.props.style}
            active={this.props.selected.includes(item)}
            onClick={this.handleButtonClick}
          />
        ))}
        {this.props.hasTextInput && (
          <TextInput
            style={{ ...this.props.style, ...this.props.inputStyle }}
            onClick={this.handleInputClick}
            onChange={this.handleInputChange}
            validInput={this.props.validInput}
            placeholder={this.props.placeholderInput}
            type={this.props.inputType}
          />
        )}
      </div>
    );
  }
}

ButtonGroup.propTypes = {
  items: PropTypes.array,
  style: PropTypes.object,
  multSelect: PropTypes.bool,
  default: PropTypes.string,
  selected: PropTypes.array,
  category: PropTypes.string,
  modifySelected: PropTypes.func,
  hasTextInput: PropTypes.bool,
  inputStyle: PropTypes.object,
  placeholderInput: PropTypes.string,
  validInput: PropTypes.func,
  inputType: PropTypes.string
};
/***
 * Props:
 *
 * items: List of strings, each corresponding to a button. If you have a default button, don't include it in here.
 * style: Object with styling for buttons
 * multSelect: True, if you can select 1+ buttons in items (either default or 1+ in items), false if you can only select 1 button
 * default: "" if none, otherwise the default button that's selected when ButtonGroup is rendered and will be selected if no other button is selected.
 * selected: An array of the names of selected/active buttons
 * category: The name of the key corresponding to {category: selected} in the parent component
 * modifySelected: The function called when a button is clicked. Takes category and a list of selected/active buttons as params
 * textInput: True, if you want to include a text input box, false otherwise
 * the following are required only if textInput is true:
 * inputStyle: Object with styling for text input (applied after style)
 * placeholderInput: placeholder for text input
 * validInput: A function called to determine if an input is still valid after the user enters something(if not, input doesn't update)
 * inputType: Type of input (ex: text, time)
 */
export default ButtonGroup;
