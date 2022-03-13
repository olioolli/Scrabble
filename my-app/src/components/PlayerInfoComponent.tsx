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
        <PlayerNameDiv>{props.name}</PlayerNameDiv>
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
  font-weight: bold;
`;

const PlayerNameDiv = styled.div`
  font-weight: bold;
  text-decoration: underline;
  color: #2e4289;
`;

const NewPointsDiv = styled.div`
background-color: #636a3f;
    padding-top: 20px;
    padding-left: 5px;
    padding-right: 13px;
    border: 1px;
    width: 10px;
    border-style: inset;
    border-color: #eef1e3;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    height: 37px;
    margin-top: 2px;
    border-style: inset;
`;

const PlayerContainer = styled.div`
      padding: 10px;  
      min-width: 57px;
      padding-left: 15px;
      display: flex;
      flex-direction: column;
      background-color: #636a3f;
    & > div {
      display: inline-block;
    }
    `;

const PointButton = styled.button`
      height: 100%;
      background-color: #eef1e3;
    `;

const FlexDivRow = styled.div`
    display: flex;
    flex-direction: row;
    padding: 10px;
    border-top: 1px solid white;
    border-top-style: inset;
    `;

const FlexDivCol = styled.div`
    display: flex;
    flex-direction: column;
    `;