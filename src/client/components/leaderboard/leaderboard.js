import React from 'react';
import PropTypes from 'prop-types';
import { Table, Card, CardHeader, Badge } from 'reactstrap';

class Leaderboard extends React.Component {
  static propTypes = {
    scores: PropTypes.any.isRequired,
    names: PropTypes.any.isRequired,
    cards: PropTypes.any.isRequired,
    playerID: PropTypes.any.isRequired,
    passed: PropTypes.any.isRequired,
  };
  render() {
    let passed = this.props.passed;
    function hasPassed(_idx) {
      for(let i=0; passed[i] !== undefined; i++) {
        if(passed[i] ===_idx.toString()) {
          return true;
        }
      }
      return false;
    }
    return (
      <Card>
        <CardHeader>Statistics</CardHeader>
          <Table size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>passed</th>
                <th>Card</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {this.props.scores.map((val,idx) => 
                <tr key={idx}>
                  <td>{idx}</td>
                  <td>{this.props.names[idx]} <strong> {
                  (parseInt(this.props.playerID) === idx) ? '(you)' : ""}</strong></td>
                  <td>
                   <p align="center" className={(hasPassed(idx)) ? "visible" : "invisible" }>&#10003;</p></td>
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