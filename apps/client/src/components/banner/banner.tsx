import React from 'react';
import type { FC } from 'react';
import './banner.css';

const Banner: FC = () => {
  if (process.env.REACT_APP_EOP_BANNER_TEXT) {
    return (
      <div className="banner">{process.env.REACT_APP_EOP_BANNER_TEXT}</div>
    );
  }
  return null;
};

export default Banner;
