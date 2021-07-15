import React from 'react';
import {Button} from 'reactstrap';
import { copyToClipboard } from '../../../utils/utils';
import PropTypes from 'prop-types';

class CopyButton extends React.Component {
    static propTypes = {
        color: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {color: this.props.color};
    }

    render() {
        return (
            <Button color={this.state.color} onClick={() => this.handleClick()}>
                Copy
            </Button>
        )
    }

    handleClick() {
        copyToClipboard(this.state.text).then(() => {
            this.setState({color: 'success'});
            
        }, () => {
            //If the copy fails, maybe alert the user somehow
            this.setState({color: 'danger'})
        });
        setTimeout(() => {
            this.setState({color: this.props.color})
        }, 500);
    }
}

export default CopyButton;