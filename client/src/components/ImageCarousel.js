import React, { Component } from "react";
import PropTypes, { string } from 'prop-types';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

/**
 * Wrapper for an Image Slider Component
 */
class ImageCarousel extends Component {

  /**
   * Constructor.
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**Image component.
   * 
   * @param {string} img The link to the image.
   * @return {React.Component} An image element.
   */
  CarouselItem(img) {
    return <img src={img} alt="food" key={img} style={{ borderRadius: "5%" }} />;
  }

  /**
   * Renders components.
   */
  render() {
    return (
      <Carousel
        axis={"horizontal"}
        showThumbs={false}
        dynamicHeight={true}
        width={"100%"}
      >
        {this.props.images.map(img => this.CarouselItem(img))}
      </Carousel>
    );
  }
}

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(string)
}
export default ImageCarousel;
