import React from 'react';
import PropTypes from 'prop-types';
import './license.css';

class License extends React.Component {
    static propTypes = {
    };

    render() {

        return (
            <div className="license">
                The card game
                <a href="https://www.microsoft.com/en-us/download/details.aspx?id=20303"> Elevation of Privilege </a>
                by
                <a href="https://adam.shostack.org/"> Adam Shostack </a> (Microsoft)
                is licensed under
                <a href="https://creativecommons.org/licenses/by/3.0/us/"> CC-BY-3.0</a>
                .
            </div>
        );
    }
}

export default License;