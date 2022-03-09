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

-add env file for configuring IPs
-Visual improvements
-Get rid of warnings pt2

-tile broken vertical alignment (caused by special board tiles) (DONE)
 *Move board tile text to it's own element (DONE)
 *Fix alignment (DONE)
-auto draw initial 7 tiles (DONE)
-re-arrange hand during opps turn (DONE)
-Send point updates to backend (DONE)
-reduce letter count / timer (DONE)

2nd Iteration
*Login (player name)
*Setup view before game starts
*Single URL for all players
*support for 'several' players
*more visual improvements
*small screen scaling
*Add reset game button somewhere
*Indicate which player's screen is currently visible
*Performance enhancements: Add useCallbacks etc
*/
