import React from 'react';
import type { FC } from 'react';

const Privacy: FC = () => {
  if (process.env.REACT_APP_EOP_PRIVACY) {
    return (
      <a href={process.env.REACT_APP_EOP_PRIVACY}>Privacy</a>
    );
    }
    return (<></>);
}

export default Privacy;
