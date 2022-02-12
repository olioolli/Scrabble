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

1st Iteration
*No login / players
*Point setup for 2 players
*Two URLs for players for showing different hands

2nd Iteration
*Login (player name)
*Setup view before game starts
*Single URL for all players
*support for 'several' players

TASKS

IT1

-Implement getting tiles from pouch
 *Show pouch letter count (DONE)
 *Put letter in pouch
 *Draw letter from pouch (DONE)

-Implement pushing updates from server to client (DONE)
 *Websocket? (DONE)
 *When tile placed, turn ended, etc client should update game state from be (DONE)

-Prevent dragging tiles on board
 *Track if tile was placed this turn or not
 *Allow dragging of tiles placed this turn


-Send point updates to backend

-Add reset game button somewhere

-Performance enhancements: Add useCallbacks etc

-Get rid of warnings

MISC
*Indicate which player's screen is currently visible
IT2

-Implement player turns
 *Display current players hand (same URL)

 -Implement login
 *Add player to session
*/
