import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "../utils/googleApiKey"
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

/**
 * Wrapper for a wrapper for a Google Map. Displays a marker at a location.
 */
export class MapContainer extends Component {

  /**
   * Constructor.
   * 
   * @param {Object} props 
   */
  constructor(props) {
    super(props);

    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    };
  }

  /**
   * Called when the marker is clicked.
   *
   * @param {Object} props
   * @param {*} marker The marker that got clicked
   * @param {React.SyntheticEvent} e
   */
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  /**
   * Called when the map is clicked.
   *
   * @param {Object} props
   */
  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  /**
   * Renders the map.
   */
  render() {
    const infoStyle = {
      fontSize: "1rem",
      color: "black"
    };

    return (
      <Map
        google={this.props.google}
        onClick={this.onMapClicked}
        style={this.props.style}
        initialCenter={this.props.initialCenter}
        zoom={this.props.zoom}
      >
        <Marker onClick={this.onMarkerClick} name={this.props.name} />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h3 style={infoStyle}>{this.state.selectedPlace.name}</h3>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

Map.propTypes = {
  google: PropTypes.any,
  style: PropTypes.object,
  initialCenter: PropTypes.object,
  zoom: PropTypes.number,
  name: PropTypes.string
};

export default GoogleApiWrapper({
  apiKey: key
})(MapContainer);
