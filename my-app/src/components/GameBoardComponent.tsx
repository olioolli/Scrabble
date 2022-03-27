import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BoardTileComponent, TileDropType } from './BoardTileComponent';
import { HandComponent } from './HandComponent';
import { PouchComponent } from './PouchComponent';
import { BoardTile, GameState, LetterTile } from '../../../scrabble-backend/server';
import { getCurrentPlayerName } from '../util/utils';
import { useGameState } from '../util/GameStateProvider';
import { useCallback } from 'react';
import { PlayerInfo } from './PlayerInfoComponent';
import { DialogComponent } from './DialogComponent';

export const GameBoardComponent = () => {

    const { gameState, 
        moveLetterFromHandToBoard, 
        getPlayers, 
        togglePlayerTurn, 
        moveLetterToPouchFromHand,
        updatePlayerPoints,
        moveLetterFromBoardToBoard,
        moveLetterFromBoardToHand,
        sendNewGameRequest } = useGameState();

    const [ isPopupVisible, setPopupVisible ] = useState(false);

    const handleLetterTileDrop = async (letterTile: LetterTile,dropType: TileDropType, x: number, y: number, newX?: number, newY?: number) => {
        if (dropType === TileDropType.HAND_TO_POUCH )
            await moveLetterToPouchFromHand(letterTile);
        else if( dropType === TileDropType.HAND_TO_BOARD )
            await moveLetterFromHandToBoard(letterTile, x, y);
        else if( dropType == TileDropType.BOARD_TO_HAND )
            await moveLetterFromBoardToHand(letterTile);
        else
            await moveLetterFromBoardToBoard(letterTile, x, y);
    };

    const handleEndTurnClicked = useCallback(async () => {
        await togglePlayerTurn();
    }, [togglePlayerTurn]);

    const isCurrentPlayerActive = useCallback(() => {
        return getCurrentPlayerName() === gameState.turnOfPlayer;
    }, [gameState, getCurrentPlayerName]);

    const handlePointsUpdated = async (playerName : string, newPoints : number) => {
        await updatePlayerPoints(playerName, newPoints);
    };

    return (
        <div>
            <MainDiv>
                {
                    isCurrentPlayerActive() ? <></> : <InactivePlayerBlocker>Not your turn</InactivePlayerBlocker>
                }
                <BoardComponent>
                    {gameState.board.map((x, y) => (
                        x.map((tile, i) => (
                            <BoardTileComponent
                                key={i}
                                letterTile={ tile.letterTile }
                                tileXPos={y}
                                tileYPos={i}
                                tileDropped={handleLetterTileDrop}
                                tileType={tile.tileType}>
                            </BoardTileComponent>))
                    ))}
                </BoardComponent>

                <RightPanel>
                    <PlayerContainer>
                    {getPlayers().map(player => (
                        <PlayerInfo isActive={gameState.turnOfPlayer === player} key={player} points={gameState.playerPoints[player]} name={player} pointsUpdated={handlePointsUpdated}></PlayerInfo>
                        ))}
                    </PlayerContainer>
                    <EndTurnButton onClick={handleEndTurnClicked} >End turn</EndTurnButton>
                    <EndTurnButton onClick={ () => { setPopupVisible(true)}}>New game</EndTurnButton>
                </RightPanel>
                <BottomContainer>
                    <HandComponent tileDropped={handleLetterTileDrop} letters={gameState.playerHands[getCurrentPlayerName()] !== undefined ? gameState.playerHands[getCurrentPlayerName()] : []} />
                    <PouchComponent
                        letters={gameState.pouchLetters !== undefined ? gameState.pouchLetters : []}
                        tileDropped= {handleLetterTileDrop}
                    />
                </BottomContainer>
            </MainDiv>
            {isPopupVisible ? <DialogComponent 
                text={"Really start a new game?"} okText={"OK"} cancelText={"Cancel"}
                cancelClicked={ () => setPopupVisible(false) }
                okClicked={ () => {
                    sendNewGameRequest();
                    setPopupVisible(false);
                }}
                ></DialogComponent> : <></>}
        </div>
    );
}

const RightPanel = styled.div`
    position: absolute;
    right: 10%;
    top: 1px;
`;

const PlayerContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    border: 1px solid #ffffff;
    padding: 5px;
    margin-top: 10px;
    border-radius: 4px;
    background: #636a3f;
    `;

const EndTurnButton = styled.button`
width: 100px;
padding: 5px;
height: 50px;
background: #eef1e3;
border-radius: 4px;
margin-top: 10px;
padding: 10px;
    margin-left: 10px;
    font-weight: bold;
    background-color: #eef1e3;
`;

const MainDiv = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`;

const InactivePlayerBlocker = styled.div`
  width: 100%;
  height: 100%;
  z-index: 10000;
  background: #762f2f;
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0.6;
`;

const MainContainer = styled.div`
	dispaly: flex;
`;

const BottomContainer = styled.div`
	display: flex;
	justify-content: center;
    margin-top: 10px;
`;

const BoardComponent = styled.div`
display: grid;
    grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto;
    background-color: #2e4289;
    padding: 2px;
    width: 718px;
    margin: auto;
    margin-top: 5px;
    padding: 8px;
    padding-right: 8px;
    border-radius: 3px;
`;
