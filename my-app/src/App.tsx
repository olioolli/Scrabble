import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import styled from 'styled-components';
import { MainView } from './components/MainView';
import { useEffect, useRef, useState } from 'react';
import { isLoggedIn, login } from './util/utils';
import axios from 'axios';
import { BE_URL } from './state';
import { toast } from 'react-toastify';
import ScrabbleLogo from './components/ScrabbleLogo';

function App() {

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {

    if (document.cookie === '')
      setIsUserLoggedIn(false);

    axios.get(BE_URL + "/isLoggedIn?username=" + document.cookie).then((response) => {
      if (response.status == 200) {
        const data = response.data;
        console.log("IS logged in user: "+document.cookie);
        console.log("GOT RESP: "+data.isLoggedIn);
        setIsUserLoggedIn(data.isLoggedIn);
      }
      else
        setIsUserLoggedIn(false);
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/">
          {isUserLoggedIn ?
            <MainView></MainView> :
            <PlayerSelectView></PlayerSelectView>}
        </Route>
      </Switch>
    </Router>

  );
};

const PlayerSelectView = () => {
  const usernameRef = useRef(null);

  const logUserIn = () => {

    if (!usernameRef || !usernameRef.current)
      return;

    const username = (usernameRef.current as HTMLInputElement).value;
    if (username && username !== '') {
      login(username)
    }
  };

  return (
    <LoginMainDiv>
      <ScrabbleLogo></ScrabbleLogo>
      <PlayerSelectContainer>
        <TitleH2>Insert username</TitleH2>
        <TextField ref={usernameRef} placeholder={"Username"}></TextField>
        <Button onClick={() => logUserIn()}>Enter</Button>
      </PlayerSelectContainer>
    </LoginMainDiv>
  );

}

const LoginMainDiv = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`;

const TitleH2 = styled.h2`
  font-weight: normal;
  margin-bottom: 25px;
    margin-top: 2px;
`;

const Button = styled.button`
padding: 15px;
    margin-top: 20px;
    width: 150px;
    border: 1px solid #386383;
    border-radius: 10px;
    background: #0e1d21;
    color: white;
    font-size: 14px;
}
`;

const TextField = styled.input`
    padding: 14px;
    border: 1px solid #386383;
    border-radius: 3px;
    background: #0e1d21;
    color: white;
    text-align: center;
`;

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
    background: #cf181f;
    padding: 14px;
    border-radius: 6px;
    width: 301px;
    border: 1px solid #ffffff7a;
  `;

export default App;
