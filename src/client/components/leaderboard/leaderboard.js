import React from 'react';
import PropTypes from 'prop-types';
import { Table, Card, CardHeader, Badge } from 'reactstrap';
import { passedexp } from '../status/status';

class Leaderboard extends React.Component {
  static propTypes = {
    scores: PropTypes.any.isRequired,
    names: PropTypes.any.isRequired,
    cards: PropTypes.any.isRequired,
    playerID: PropTypes.any.isRequired,
  };
  render() {
    function haspassed(_idx) {
      for(let i=0; passedexp[i] !== undefined; i++) {
        if(passedexp[i] ===_idx.toString()) {
          return "passed";
        }
      }
      return "";
    }
    return (
      <Card>
        <CardHeader>Statistics</CardHeader>
          <Table size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th></th>
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
                  <td>{
                   haspassed(idx) }</td>
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