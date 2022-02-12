import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { LoginComponent } from './components/LoginComponent';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { GameBoardComponent } from './components/GameBoardComponent';
import styled from 'styled-components';
import { Lobby } from './components/Lobby';
import axios from 'axios';
import { MainView } from './components/MainView';



function App() {

  return (
    <Router>
      <Switch>
        <Route path="/main">
         <PlayerSelectView></PlayerSelectView>
        </Route>
        <Route path="/player1">
          <MainView></MainView>
        </Route>
        <Route path="/player2">
          <MainView></MainView>
        </Route>
      </Switch>
    </Router>

  );
};

const PlayerSelectView = () => {

  return (
    <PlayerSelectContainer>
      <TitleText>Scrabble 5000</TitleText>
      <h1>Select a player:</h1>
      <PlayerLink href={"/player1"}>Player 1</PlayerLink>
      <PlayerLink href={"/player2"}>Player 2</PlayerLink>
    </PlayerSelectContainer>
  );
  
}

const TitleText = styled.p`
font-size: 60px;
color: #386383;
`;

const PlayerLink = styled.a`
    font-size: 20px;
`;

const PlayerSelectContainer = styled.div`
    display: flex;
    color: white;
    flex-direction: column;
    align-content: center;
    align-items: center;
    margin-top:10%;
  `;
/*
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
*/
export default App;
