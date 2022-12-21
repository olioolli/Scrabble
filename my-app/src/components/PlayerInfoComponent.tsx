import React, { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { isMobileScreenWidth } from '../util/utils';

export type PlayerInfoProps = {
  pointsUpdated: (playerName: string, newPointValue: number) => void;
  isActive: boolean,
  name: string
  points: number;
  playerInfoClicked: (playerName: string) => void;
  showBigControls?: boolean;
  setOpenWndPlayerName?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const PlayerInfo = (props: PlayerInfoProps) => {

  const [points, setPoints] = useState(0);
  const [newPoints, setNewPoints] = useState(0);

  const mobile = isMobileScreenWidth();

  useEffect(() => {
    setPoints(props.points);
  }, [props.points]);

  const handlePointsChanged = (change: number) => {
    setNewPoints(change + newPoints);
    //props.pointsUpdated(props.name, points);
  };

  const handeAddPoints = () => {
    props.pointsUpdated(props.name, points + newPoints);
    setNewPoints(0);
    if( props.setOpenWndPlayerName )
      props.setOpenWndPlayerName(undefined);
  };

  const showControls = props.showBigControls || !mobile;
  const showBigControls = props.showBigControls ? props.showBigControls : false;

  const getNewPointsText = () => {
    if( newPoints > 0 )
      return '+'+newPoints;

    return ""+newPoints
  }

  const getPointButtonComponent = (isPlusBtn: boolean) => {
    const sign = isPlusBtn ? '+' : '-';

    return showBigControls ? 
      <MobileButton mobileControls={showBigControls} onClick={() => handlePointsChanged(isPlusBtn ? 1 : -1)}>{sign}</MobileButton> :
      <PointButton mobileControls={showBigControls} onClick={() => handlePointsChanged(isPlusBtn ? 1 : -1)}>{sign}</PointButton>
  }

  const getSendButton = () => {
    if( showBigControls )
      return <MobileSendPointsButton mobileControls={showBigControls} onClick={handeAddPoints} >Add</MobileSendPointsButton>      
    else
      return <SendPointsButton mobileControls={showBigControls} onClick={handeAddPoints} >Add</SendPointsButton>
  }

  return (
    <FlexDivRow mobileControls={mobile} onClick={() => mobile && props.playerInfoClicked(props.name)}>
      <PlayerContainer mobileControls={showBigControls}>
        <PlayerNameDiv>{props.name}</PlayerNameDiv>
        <div>{points + "pts"}</div>
        {showBigControls && <NewPointsDiv mobileControls={showBigControls}>{getNewPointsText()}</NewPointsDiv>}
      </PlayerContainer>
      {showControls && (
        <>
          { !showBigControls && <NewPointsDiv mobileControls={showBigControls}>{getNewPointsText()}</NewPointsDiv> }
          <FlexDivCol>
            {getPointButtonComponent(true)}
            {getPointButtonComponent(false)}
          </FlexDivCol>
          {getSendButton()}
        </>
      )}
    </FlexDivRow>
  )
}

const SendPointsButton = styled.button`
  font-weight: bold;
`;

const MobileSendPointsButton = styled.button`
font-weight: bold;
width: 4rem;
margin-left: 1rem;
background-color: #365050;
      border-radius: 5px;
      border-style: solid;
      margin-top: 6px;
      font-weight: bold;
`;

const PlayerNameDiv = styled.div`
  font-weight: bold;
  text-decoration: underline;
  color: #2e4289;
`;

const NewPointsDiv = styled.div`
    background-color: ${props => props.mobileControls ? '#96a9a9' : 'none'};
    padding-top: 20px;
    padding-left: 5px;
    padding-right: 13px;
    border: 1px;
    width: ${props => props.mobileControls ? '2rem' : '10px'};
    border-style: inset;
    border-color: #eef1e3;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    height: 37px;
    margin-top: 2px;
    border-style: inset;
    text-align: center;
    border-radius: 5px;
    border: none;
    padding-left: 11px;
    font-weight: bold;
    margin-right: ${props => props.mobileControls ? 'initial' : '12px'};
`;

const PlayerContainer = styled.div`
      padding: 10px;  
      min-width: 57px;
      padding-left: 15px;
      display: flex;
      flex-direction: column;
      margin-right: ${props => props.mobileControls ? '0.5rem' : 'initial'};
    & > div {
      display: inline-block;
    }
    `;

const PointButton = styled.button`
      height: 100%;
    `;

const MobileButton = styled.button`
width: 4rem;
height: 4rem;
background-color: #365050;
      border-radius: 5px;
      border-style: solid;
      margin-top: 6px;
      font-weight: bold;
      font-size: 22px;
      font-family: fantasy;
`

const FlexDivRow = styled.div`
    display: flex;
    flex-direction: row;
    padding: 10px;
    border-top: ${props => props.mobileControls ? 'none' : '1px solid white'};
    border-top-style: ${props => props.mobileControls ? 'none' : 'inset'};
    `;

const FlexDivCol = styled.div`
    display: flex;
    flex-direction: column;
    `;