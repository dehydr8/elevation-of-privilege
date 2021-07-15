import React from 'react';
import {Button} from 'reactstrap';
import { copyToClipboard } from '../../../utils/utils';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

class CopyButton extends React.Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        color: PropTypes.string,
        active: PropTypes.bool,
        block: PropTypes.bool,
        disabled: PropTypes.bool,
        outline: PropTypes.bool,
        size: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            color: this.props.color,
            copied: false
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
                <FontAwesomeIcon icon={this.state.copied ? faCheck : faCopy} />
                {' '}
                {this.props.children}
            </Button>
        )
    }

    handleClick() {
        copyToClipboard(this.props.text).then(() => {
            this.setState({color: 'success', copied: true});
            
        }, () => {
            //If the copy fails, maybe alert the user somehow
            this.setState({color: 'danger'})
        });
        setTimeout(() => {
            this.setState({color: this.props.color, copied: false})
        }, 500);
    }
}

export default CopyButton;