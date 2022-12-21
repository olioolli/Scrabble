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

*New game doesn't draw letters
*Special tile visibility under letter tile
*Show hand size
*Improve login screen (toasts, visuals etc.)
*more visual improvements (Icons, logos, etc.)
*Title, favicon
*Performance enhancements: Add useCallbacks etc
*Get rid of warnings pt2
*Env file for IP setup
*/
