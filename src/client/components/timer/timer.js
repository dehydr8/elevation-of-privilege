import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import PropTypes from 'prop-types';

import './timer.css';

const renderTime = ({ remainingTime }) => {
  return (
    <div className="timer">
      <div className="value">
        {Math.floor(remainingTime / 60)}:
        {(remainingTime % 60).toString().padStart(2, '0')}
      </div>
    </div>
  );
};

class Timer extends React.Component {
  static get propTypes() {
    return {
      active: PropTypes.bool,
      duration: PropTypes.number.isRequired,
      targetTime: PropTypes.number,
    };
  }

  static get defaultProps() {
    return {
      active: true,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      painted: false,
    };

    // This is a bit of a workaround
    // The timer is updated with window.requestAnimationFrame however the page can be rendered before
    // this is called if it is not the current tab. This means the remaining time will be set to the
    // duration but doesn't start counting down until the tab is opened
    // By updating the component when requestAnimationFrame is first called, the initial remaining
    // time is reset and the timer shows the correct time
    window.requestAnimationFrame(() => {
      if (!this.state.painted) {
        this.setState({
          ...this.state,
          painted: true,
        });
      }
    });
  }

  render() {
    const timeDifferenceInSeconds = Math.floor(
      (this.props.targetTime - Date.now()) / 1000,
    );
    if (this.props.active && this.props.duration > 0) {
      return (
        <div className="timer-wrapper">
          <CountdownCircleTimer
            key={`timer-${this.state.active}-${this.state.painted}`}
            isPlaying
            size={150}
            duration={this.props.duration}
            initialRemainingTime={Math.max(timeDifferenceInSeconds, 0)}
            colors={[
              ['#28a745', 0.625],
              ['#ffc107', 0.25],
              ['#dc3545', 0.125],
            ]}
            onComplete={() => false}
          >
            {renderTime}
          </CountdownCircleTimer>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Timer;
