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

Iteration 1 (DONE)

-Draw upto 7 on end turn (DONE)
-Prevent manual draw (DONE)
-Tile disappear? (id issues related? DONE?)

2nd Iteration

*Add new game button somewhere (DONE)

*Improve login screen (toasts, visuals etc.)
*more visual improvements (Icons, logos, etc.)
*Performance enhancements: Add useCallbacks etc
*Get rid of warnings pt2
*Env file for IP setup
*/
