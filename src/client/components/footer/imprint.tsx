import React from 'react';
import type { FC } from 'react';

const Imprint: FC = () => {
  if (process.env.REACT_APP_EOP_IMPRINT) {
    return (
      <a href={process.env.REACT_APP_EOP_IMPRINT}>Imprint</a>
    );
  }
  return null;
  
}

export default Imprint;
