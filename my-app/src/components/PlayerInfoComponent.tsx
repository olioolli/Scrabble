import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { isMobileScreenWidth } from '../util/utils';

export type PlayerInfoProps = {
  pointsUpdated: (playerName: string, newPointValue: number) => void;
  isActive: boolean;
  name: string;
  points: number;
  playerInfoClicked?: (playerName: string) => void;
  showBigControls?: boolean;
  setOpenWndPlayerName?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const PlayerInfo = (props: PlayerInfoProps) => {
  const [points, setPoints] = useState(0);
  const [newPoints, setNewPoints] = useState(0);

  const mobile = isMobileScreenWidth();

  useEffect(() => {
    setPoints(props.points);
  }, [props.points]);

  const handlePointsChanged = (change: number) => {
    setNewPoints((prev) => prev + change);
  };

  const handleAddPoints = () => {
    props.pointsUpdated(props.name, points + newPoints);
    setNewPoints(0);
    if (props.setOpenWndPlayerName) props.setOpenWndPlayerName(undefined);
  };

  const showControls = props.showBigControls || !mobile;

  const newPointsDisplay = newPoints > 0 ? `+${newPoints}` : `${newPoints}`;

  return (
    <PlayerCard 
      isActive={props.isActive} 
      onClick={() => mobile && props.playerInfoClicked && props.playerInfoClicked(props.name)}
    >
      <PlayerDetails>
        <PlayerName>{props.name}</PlayerName>
        <PlayerScore>{points} pts</PlayerScore>
      </PlayerDetails>
      {showControls && (
        <PointEditor showBigControls={props.showBigControls}>
          <AdjustButton onClick={() => handlePointsChanged(-1)}>-</AdjustButton>
          <NewPointsDiv>{newPointsDisplay}</NewPointsDiv>
          <AdjustButton onClick={() => handlePointsChanged(1)}>+</AdjustButton>
          <AddButton onClick={handleAddPoints}>Add</AddButton>
        </PointEditor>
      )}
    </PlayerCard>
  );
};

const PlayerCard = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 12px;
  background-color: #f7f7f7;
  border-radius: 8px;
  border: 2px solid ${(props) => (props.isActive ? '#365050' : '#e0e0e0')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PlayerDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const PlayerName = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: #2e4289;
`;

const PlayerScore = styled.div`
  font-size: 1.1em;
  font-weight: 500;
`;

const PointEditor = styled.div<{ showBigControls?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.showBigControls ? '12px' : '8px')};
`;

const NewPointsDiv = styled.div`
  background-color: #eef1e3;
  padding: 8px 12px;
  border-radius: 5px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
`;

const StyledButton = styled.button`
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #365050;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #4a6a6a;
  }
`;

const AdjustButton = styled(StyledButton)`
  width: 35px;
  height: 35px;
  font-size: 20px;
`;

const AddButton = styled(StyledButton)`
  padding: 8px 16px;
  margin-left: auto; /* Pushes the button to the right */
`;
