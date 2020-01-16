import React from 'react';
import PropTypes from 'prop-types';

export default class ClassifiedImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="image--container">
          <img
            alt="Classified results"
            className="output--image"
            src={this.props.image.url || this.props.image.image_data}
          />
        </div>
      </div>
    );
  }

}

ClassifiedImage.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string,
    image_data: PropTypes.string,
  }).isRequired,
};