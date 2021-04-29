import React from 'react';
import ReactDOM from 'react-dom';
import './client/styles/cards.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import App from './client/pages/app';
import Create from './client/pages/create';
import About from './client/pages/about';
import * as serviceWorker from './client/serviceWorker';

ReactDOM.render(
  <Router>
    <div>
      <Route path="/:game/:id/:secret" component={App} />
      <Route exact path="/" component={Create} />
      <Route exact path="/about" component={About} />
    </div>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
