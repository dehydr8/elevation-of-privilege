import React from 'react';
import { Button } from 'reactstrap';
import { faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { API_PORT } from '../../../utils/serverConfig';

class DownloadButton extends React.Component {
  static get propTypes() {
    return {
      color: PropTypes.string,
      active: PropTypes.bool,
      block: PropTypes.bool,
      disabled: PropTypes.bool,
      outline: PropTypes.bool,
      size: PropTypes.string,
      apiEndpoint: PropTypes.string.isRequired,
      matchID: PropTypes.string.isRequired,
      secret: PropTypes.string,
      playerID: PropTypes.any.isRequired,
      children: PropTypes.any.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.apiBase =
      process.env.NODE_ENV === 'production'
        ? '/api'
        : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
    this.apiEndpointUrl = this.apiEndpointUrl.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      color: this.props.color,
      icon: faDownload,
    };
  }

  apiEndpointUrl() {
    return `${this.apiBase}/game/${this.props.matchID}/${this.props.apiEndpoint}`;
  }

  getFilename(response) {
    const header = response.headers.get('Content-Disposition');
    return header ? header.match(/filename="(.*)"$/)[1] : 'untitled';
  }

  auth() {
    const user = this.props.playerID;
    const pass = this.props.secret;
    return {
      Authorization:
        'Basic ' + btoa(user + ':' + pass),
    };
  }

  async handleClick() {
    try {
      const res = await fetch(this.apiEndpointUrl(), { headers: this.auth() });
      if (!res.ok) {
        throw Error(res.statusText);
      }

      const blob = await res.blob();
      let a = document.createElement('a');

      a.href = URL.createObjectURL(blob);
      a.download = this.getFilename(res);
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      this.setState({ icon: faTimes, color: 'danger' });
      setTimeout(() => {
        this.setState({ icon: faDownload, color: this.props.color });
      }, 500);
      console.error(err);
      return;
    }
  }

  render() {
    return (
      <Button
        color={this.state.color}
        onClick={this.handleClick}
        active={this.props.active}
        block={this.props.block}
        disabled={this.props.disabled}
        size={this.props.size}
      >
        <FontAwesomeIcon icon={this.state.icon} fixedWidth /> &nbsp;
        {this.props.children}
      </Button>
    );
  }
}

export default DownloadButton;
