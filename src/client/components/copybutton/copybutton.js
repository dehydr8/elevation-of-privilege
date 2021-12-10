import React from 'react';
import { Button } from 'reactstrap';
import { copyToClipboard } from '../../utils/utils';
import { faCopy, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

class CopyButton extends React.Component {
  static get propTypes() {
    return {
      text: PropTypes.string.isRequired,
      color: PropTypes.string,
      active: PropTypes.bool,
      block: PropTypes.bool,
      disabled: PropTypes.bool,
      outline: PropTypes.bool,
      size: PropTypes.string,
      children: PropTypes.any.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      color: this.props.color,
      icon: faCopy,
    };

    this.handleClick = this.handleClick.bind(this);
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
        <FontAwesomeIcon icon={this.state.icon} fixedWidth />{' '}
        {this.props.children}
      </Button>
    );
  }

  async handleClick() {
    try {
      await copyToClipboard(this.props.text);
      this.setState({ color: 'success', icon: faCheck });
    } catch (err) {
      //If the copy fails, maybe alert the user somehow
      this.setState({ color: 'danger', icon: faTimes });
    } finally {
      setTimeout(() => {
        this.setState({ color: this.props.color, icon: faCopy });
      }, 500);
    }
  }
}

export default CopyButton;
