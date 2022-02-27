import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
TASKS

Iteration 1

-small screen scaling
-Send point updates to backend
-reduce letter count / timer

-tile broken vertical alignment (caused by special board tiles)
-Add reset game button somewhere
-Performance enhancements: Add useCallbacks etc
-Get rid of warnings pt2
-Indicate which player's screen is currently visible
-Visual improvements

-move letter from board->hand (DONE)
-rearrange hand (DONE)
-Remove warnings pt1 (DONE)


2nd Iteration
*Login (player name)
*Setup view before game starts
*Single URL for all players
*support for 'several' players
*more visual improvements
*/
