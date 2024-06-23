import React, { FC, useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import './timer.css';

const renderTime: FC<{ remainingTime: number }> = ({ remainingTime }) => {
  return (
    <div className="timer">
      <div className="value">
        {Math.floor(remainingTime / 60)}:
        {(remainingTime % 60).toString().padStart(2, '0')}
      </div>
    </div>
  );
};

type TimerProps = {
  active?: boolean;
  duration: number;
  targetTime: number;
};

const Timer: FC<TimerProps> = ({ active = true, duration, targetTime }) => {
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    // This is a bit of a workaround
    // The timer is updated with window.requestAnimationFrame however the page can be rendered before
    // this is called if it is not the current tab. This means the remaining time will be set to the
    // duration but doesn't start counting down until the tab is opened
    // By updating the component when requestAnimationFrame is first called, the initial remaining
    // time is reset and the timer shows the correct time
    const animationFrame = window.requestAnimationFrame(() => {
      if (!painted) {
        setPainted(true);
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [painted]);

  const timeDifferenceInSeconds = Math.floor((targetTime - Date.now()) / 1000);

  return active && duration > 0 ? (
    <div className="timer-wrapper" data-testid="timer-wrapper">
      <CountdownCircleTimer
        key={`timer-${active}-${painted}`}
        isPlaying
        size={150}
        duration={duration}
        initialRemainingTime={Math.max(timeDifferenceInSeconds, 0)}
        colors={['#28a745', '#ffc107', '#dc3545']}
        colorsTime={[0.625, 0.25, 0.125]}
        onComplete={() => ({
          shouldRepeat: false,
          newInitialRemainingTime: 0,
        })}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>
  ) : null;
};

export default Timer;
