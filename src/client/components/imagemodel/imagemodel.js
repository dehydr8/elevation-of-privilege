import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';


class ImageModel extends React.Component {

  constructor(props) {
    super(props);
    this.auth = this.auth.bind(this);
    this.setState({
      imgSrc: null
    });
  }

  auth() {
    const user = this.props.playerID;
    const pass = this.props.credentials;
    return {'Authorization': 'Basic ' + Buffer.from(user + ':' + pass).toString('base64')};
  }

  async updateImage() {
    // cannot use apiRequest because this must be done using fetch API
    const res = await fetch(
      `${this.apiBase}/game/${this.props.matchID}/image`, 
      { headers: this.auth() }
    );
    if (!res.ok) {
      throw Error(res.statusText);
    }

    const blob = await res.blob();

    this.setState({
      ...this.state,
      imgSrc: URL.createObjectURL(blob)
    });
  }

  componentDidMount() {
    this.updateImage();
  }

  render() {
    return (
      <div className="model">
        <Helmet>
          {/* Make this title more specific? */}
          <title>EoP</title>
        </Helmet>
        <img src={this.state.imgSrc} alt="Architectural Model" />
      </div>
    );
  }
}

export default ImageModel;