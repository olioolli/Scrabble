import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BE_URL, usePlayers } from '../state';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const LoginComponent = () => {

    const [ isLoading, setIsLoading ] = useState(false);

    const handleLogin = () => {

        if( isLoading )
            return;

        setIsLoading(true);
        const usernameInput = document.getElementById("txtUsername") as HTMLInputElement;
        const passwordInput = document.getElementById("txtPassword") as HTMLInputElement;
        
        console.log("Sending: "+usernameInput.value+", "+passwordInput.value);
    };

    return (
        <LoginPanel>
            <TextField placeholder="Username" id="txtUsername" />
            <TextField placeholder="Password" password id="txtPassword" />
            <Button onClick={ handleLogin }>Login</Button>
            <ToastContainer></ToastContainer>
        </LoginPanel>
    );
}

const LoginPanel = styled.div`
width: 183px;
    border-radius: 6px;
    padding: 20px;
    background: #1e2529;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const TextField = styled.input.attrs(props => ({
    type: props.password ? "password" : "text"
}))`
height: 22px;
padding: 5px;
border: 2px solid 2196f3;
margin-top: 5px;
`;

const Button = styled.button`
    display: inline-block;
    height: 30px;
    background: #2196f3;
    border-radius: 4px;
    border: none;
    margin-top: 5px;
    width: 181px;

    &:hover {
      opacity: 0.8;
    }

    &:active {
        border: 1px;
        border-style: inset;
        user-select: none;
    }
`;