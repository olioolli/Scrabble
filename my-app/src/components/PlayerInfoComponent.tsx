import React, { useState } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';

export type PlayerInfoProps = {
  pointsUpdated : (playerName : string, newPointValue : number) => void;
  isActive : boolean,
  name: string
  points : number;
}

export const PlayerInfo = (props : PlayerInfoProps) => {

    const PlayerContainer = styled.div`
    border: 1px solid black;
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
  
    const [points, setPoints] = useState(props.points);
  
    const handlePointsChanged = (change : number) => {
      setPoints( points + change );
      props.pointsUpdated(props.name, points);
    };

    return (
      <FlexDivRow>
        <PlayerContainer>
          <div>{props.name}</div>
          <div>{points + "pts"}</div>
        </PlayerContainer>
        <FlexDivCol>
          <PointButton onClick={() => handlePointsChanged(1)}>+</PointButton>
          <PointButton onClick={() => handlePointsChanged(-1)}>-</PointButton>
        </FlexDivCol>
      </FlexDivRow>
    )
  }