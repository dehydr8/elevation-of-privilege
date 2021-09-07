
import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';
import CopyButton from '../copybutton/copybutton';
import '../../styles/create.css';


class LinkDisplay extends React.Component {
  static propTypes = {
    players: PropTypes.number.isRequired,
    matchID: PropTypes.string.isRequired,
    names: PropTypes.object.isRequired,
    secret: PropTypes.object.isRequired,
  };

  url(i) {
    return `${window.location.origin}/${this.props.matchID}/${i}/${this.props.secret[i]}`;
  }

  formatAllLinks() {
    return (
      'You have been invited to a game of Elevation of Privilege:\n\n' +
      Array(this.props.players).fill(0).map((v, i) => {
        return `${this.props.names[i]}:\t${this.url(i)}`;
      }).join('\n\n')
    );
  }

  render() {
    return (
      <div>
        <div className="text-center text-muted">
          <p>The following links should be distributed to the players respectively.</p>
        </div>
        <Table>
          <tbody>
            {Array(this.props.players).fill(0).map((v, i) =>
              <tr key={i}>
                <td className="c-td-name">{this.props.names[i]}</td>
                <td>
                  <a href={`${this.url(i)}`} target="_blank" rel="noopener noreferrer">{this.url(i)}</a>
                </td>
                <td>
                  <CopyButton text={this.url(i)} />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <hr />
        <CopyButton text={this.formatAllLinks()} color="warning" block size="lg">Copy All</CopyButton>
        <hr />
        <div className="text-center">
          <small className="text-muted">
            These links are unique for each player and would allow them to join the game.
          </small>
        </div>
      </div>
    );
  }
}

export default LinkDisplay;
