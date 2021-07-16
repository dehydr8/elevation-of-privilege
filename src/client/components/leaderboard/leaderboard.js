import React from 'react';
import PropTypes from 'prop-types';
import { Table, Card, CardHeader, Badge } from 'reactstrap';

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
          <Table size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Passed</th>
                <th>Card</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {this.props.scores.map((val,idx) => 
                <tr key={idx}>
                  <td>{idx}</td>
                  <td>
                    { this.props.names[idx] } { parseInt(this.props.playerID) === idx && <strong>(you)</strong> }
                  </td>
                  <td>
                  { hasPassed(idx, this) && <div align="center">&#10003;</div> }
                  </td>
                  <td><strong>{this.props.cards[idx]}</strong></td>
                  <td><Badge>{val}</Badge></td>
                </tr>
              )}
            </tbody>
          </Table>
      </Card>
    );
  }
}

export default Leaderboard;