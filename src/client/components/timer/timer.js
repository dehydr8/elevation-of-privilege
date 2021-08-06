import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import PropTypes from 'prop-types';

import "./timer.css";

const renderTime = ({ remainingTime }) => {
  // if (remainingTime === 0) {
  //   return <div className="timer">Time's up...</div>;
  // }

  return (
    <div className="timer">
      <div className="value">{Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, "0")}</div>
    </div>
  );
};

class Timer extends React.Component {
  static propTypes = {
    // Made these required bc it crashes if they're not provided
    duration: PropTypes.number.isRequired,
    targetTime: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      painted: false
    };

    // This is a bit of a workaround
    // The timer is updated with window.requestAnimationFrame however the page can be rendered before
    // this is called if it is not the current tab. This means the remaining time will be set to the 
    // duration but doesn't start counting down until the tab is opened
    // By updating the component when requestAnimationFrame is first called, the initial remaining
    // time is reset and the timer shows the correct time
    window.requestAnimationFrame(() => {
      if(!this.state.painted) {
        this.setState({
          ...this.state,
          painted: true
        });
      }
    });
  }

  render() {
    const timeDifferenceInSeconds = Math.floor((this.props.targetTime - Date.now()) / 1000);

    return (
      <div className="timer-wrapper">
        <CountdownCircleTimer
          key={this.state.painted}
          //This is a hacky way of having the component update
          isPlaying
          size={150}
          duration={this.props.duration}
          initialRemainingTime={Math.max(timeDifferenceInSeconds, 0)}
          colors={[["#28a745", 0.33], ["#ffc107", 0.33], ["#dc3545"]]}
          onComplete={() => false}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    );
  }
}

export default Timer;
