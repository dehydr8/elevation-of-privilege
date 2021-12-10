import React from 'react';
import PropTypes from 'prop-types';
import './imagemodel.css';
import { API_PORT } from '../../../utils/constants';
import { MapInteractionCSS } from 'react-map-interaction';
import { asyncSetTimeout } from '../../../utils/utils';

class ImageModel extends React.Component {
  static get propTypes() {
    return {
      playerID: PropTypes.any,
      credentials: PropTypes.string,
      matchID: PropTypes.string,
      onSelect: PropTypes.func,
      onDeselect: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.auth = this.auth.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.onError = this.onError.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDeselect = this.handleDeselect.bind(this);

    // maybe this is better defined in constants (also used by downloadbutton.js)
    this.apiBase =
      process.env.NODE_ENV === 'production'
        ? '/api'
        : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
    this.state = {
      imgSrc: undefined,
    };
  }

  auth() {
    const user = this.props.playerID;
    const pass = this.props.credentials;
    return {
      Authorization:
        'Basic ' + Buffer.from(user + ':' + pass).toString('base64'),
    };
  }

  async updateImage() {
    const res = await fetch(
      `${this.apiBase}/game/${this.props.matchID}/image`,
      { headers: this.auth() },
    );
    if (!res.ok) {
      throw Error(res.statusText);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    this.setState({
      ...this.state,
      imgSrc: url,
    });
  }

  async onError() {
    // Try again
    try {
      await asyncSetTimeout(this.updateImage, 5000);
    } catch {
      // If updateimage fails it won't then call this again
      // Handle this here.
      this.onError();
    }
  }

  handleSelect(e) {
    // Call callback if it's not a drag
    if (!e.defaultPrevented) {
      this.props.onSelect();
    }
    e.stopPropagation();
  }

  handleDeselect(e) {
    if (!e.defaultPrevented) {
      this.props.onDeselect();
    }
  }

  async componentDidMount() {
    try {
      await this.updateImage();
    } catch (err) {
      console.error(err, err.stack);
    }
  }

  render() {
    return (
      <div className="model" onClick={this.handleDeselect}>
        {this.state.imgSrc && (
          <MapInteractionCSS>
            <img
              src={this.state.imgSrc}
              alt="Architectural Model"
              onError={this.onError}
              onClick={this.handleSelect}
            />
          </MapInteractionCSS>
        )}
      </div>
    );
  }
}

export default ImageModel;
