import React from 'react';
import ReactDOM from 'react-dom';
import './Mainpage.jsx';
import CYOA_logic from './cyoaplogic';

ReactDOM.render(
  <Router>
    <mainpage path="src/mainpage" />
    <CYOA_logic path="./cyoaplogic" />
  </Router>,
  document.getElementById('root')
);