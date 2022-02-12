import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePlayers } from '../state';

export const Lobby = () => {

    const { players, setPlayers } = usePlayers();

    const updateF = () => {

        setPlayers( [ ...players,{name:"kakka"}]);
    };

    return (
        <div>
            <ul>
              {players.map( (player) => (
                <li>{player.name}</li>
              ))}
            </ul>
            <StartButton onClick={ updateF }>Start</StartButton>
            <LeaveButton></LeaveButton>
        </div>
    )
}

const StartButton = styled.button`
`;

const LeaveButton = styled.div``;

const PlayerList = styled.ul``;