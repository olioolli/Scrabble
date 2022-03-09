import React, { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';

export type PlayerInfoProps = {
  pointsUpdated: (playerName: string, newPointValue: number) => void;
  isActive: boolean,
  name: string
  points: number;
}

export const PlayerInfo = (props: PlayerInfoProps) => {

  const [points, setPoints] = useState(0);
  const [newPoints, setNewPoints] = useState(0);

  useEffect( () => {
    setPoints(props.points);
  },[props.points]);

  const handlePointsChanged = (change: number) => {
    setNewPoints(change + newPoints);
    //props.pointsUpdated(props.name, points);
  };

  const handeAddPoints = () => {
    props.pointsUpdated(props.name, points + newPoints);
    setNewPoints(0);
  };

  return (
    <FlexDivRow>
      <PlayerContainer>
        <div>{props.name}</div>
        <div>{points + "pts"}</div>
      </PlayerContainer>
      <NewPointsDiv>{newPoints}</NewPointsDiv>
      <FlexDivCol>
        <PointButton onClick={() => handlePointsChanged(1)}>+</PointButton>
        <PointButton onClick={() => handlePointsChanged(-1)}>-</PointButton>
      </FlexDivCol>
      <SendPointsButton onClick={handeAddPoints} >Add</SendPointsButton>
    </FlexDivRow>
  )
}

const SendPointsButton = styled.button`

`;

const NewPointsDiv = styled.div`
background-color: white;
padding-top: 20px;
padding-left: 10px;
padding-right: 20px;
`;

const PlayerContainer = styled.div`
      border-right: 1px solid black;
      padding: 10px;
      min-width: 57px;
      padding-left: 15px;
      display: flex;
      flex-direction: column;
      background-color: white;
    & > div {
      display: inline-block;
    }`;

const PointButton = styled.button`
      height: 100%;
    `;

const FlexDivRow = styled.div`
    display: flex;
    flex-direction: row;
    padding: 10px;
    border: ${props => props.isActive ? "red 1px solid" : "none"}
    `;

const FlexDivCol = styled.div`
    display: flex;
    flex-direction: column;
    `;