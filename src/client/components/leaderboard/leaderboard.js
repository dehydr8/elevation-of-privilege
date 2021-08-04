import React from 'react';
import PropTypes from 'prop-types';
import { Table, Card, CardHeader, Badge } from 'reactstrap';
import './leaderboard.css';
class Leaderboard extends React.Component {
  static propTypes = {
    scores: PropTypes.any.isRequired,
    names: PropTypes.any.isRequired,
    cards: PropTypes.any.isRequired,
    playerID: PropTypes.any.isRequired,
    passedUsers: PropTypes.array.isRequired,
  };
  render() {
    let passed = this.props.passedUsers;
    function hasPassed(_idx) {
      return passed.includes(_idx.toString());
    }


    return (
      <Card>
        <CardHeader>Statistics</CardHeader>
        <div className='table-container'>
          <Table size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Passed</th>
                <th>Card</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {this.props.scores.map((val, idx) =>
                <tr key={idx}>
                  <td>
                    <div className="Playername">
                      {this.props.names[idx]}
                    </div>
                    {parseInt(this.props.playerID) === idx && <div><strong>(you)</strong></div>}
                  </td>
                  <td>
                    {hasPassed(idx, this) && <div align="center">&#10003;</div>}
                  </td>
                  <td><strong>{this.props.cards[idx]}</strong></td>
                  <td><Badge>{val}</Badge></td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card >
    );
  }
}

export default Leaderboard;