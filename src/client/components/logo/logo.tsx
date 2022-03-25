import type React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const Logo: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <img
      src="logo.png"
      alt="logo"
      height="120px"
      onClick={() => history.push('/')}
    />
  );
};

export default withRouter(Logo);
