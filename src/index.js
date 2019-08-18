import React from 'react';
import ReactDOM from 'react-dom';
import './cards.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import Create from './components/create/create';
import About from './components/about/about';
import * as serviceWorker from './serviceWorker';

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
