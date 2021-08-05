import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import PropTypes from 'prop-types';

import "./timer.css";

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Time's up...</div>;
  }

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

  render() {
    const timeDifferenceInSeconds = Math.floor((this.props.targetTime - Date.now()) / 1000);

    return (
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          size={150}
          duration={this.props.duration}
          initialRemainingTime={Math.max(timeDifferenceInSeconds, 0)}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={() => false}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    );
  }
}

export default Timer;
