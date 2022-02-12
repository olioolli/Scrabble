import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BoardTileComponent } from './BoardTileComponent';
import { HandComponent } from './HandComponent';
import { PouchComponent } from './PouchComponent';
import { BoardTile, GameState, LetterTile } from '../../../scrabble-backend/server';
import { getCurrentPlayerName } from '../util/utils';
import { useGameState } from '../util/GameStateProvider';
import { useCallback } from 'react';
import { PlayerInfo } from './PlayerInfoComponent';

export const GameBoardComponent = () => {

    const { gameState, 
        moveLetterFromHandToBoard, 
        moveLetterToHandFromPouch, 
        getPlayers, 
        togglePlayerTurn, 
        moveLetterToPouchFromHand,
        updatePlayerPoints } = useGameState();

    const handleLetterTileDrop = async (letterTile: LetterTile, x: number, y: number, isTargetPouch: boolean) => {
        if (isTargetPouch)
            await moveLetterToPouchFromHand(letterTile);
        else
            await moveLetterFromHandToBoard(letterTile, x, y);
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
            <HeaderContainer>
                {
                    getPlayers().map(player => (
                        <PlayerInfo isActive={gameState.turnOfPlayer === player} key={player} points={gameState.playerPoints[player]} name={player} pointsUpdated={handlePointsUpdated}></PlayerInfo>
                    ))
                }
            </HeaderContainer>
            <MainDiv>
                {
                    isCurrentPlayerActive() ? <></> : <InactivePlayerBlocker>Not your turn</InactivePlayerBlocker>
                }
                <BoardComponent>
                    {gameState.board.map((x, y) => (
                        x.map((tile, i) => (
                            <BoardTileComponent
                                letterTile={tile.letter ? { letter: tile.letter, points: tile.points } : undefined}
                                tileXPos={y}
                                tileYPos={i}
                                tileDropped={handleLetterTileDrop}
                                tileType={tile.tileType}>
                            </BoardTileComponent>))
                    ))}
                </BoardComponent>
                <BottomContainer>
                    <HandComponent letters={gameState.playerHands[getCurrentPlayerName()] !== undefined ? gameState.playerHands[getCurrentPlayerName()] : []} />
                    <PouchComponent
                        letters={gameState.pouchLetters !== undefined ? gameState.pouchLetters : []}
                        moveLetterToHandFromPouch={moveLetterToHandFromPouch}
                    />
                </BottomContainer>
                <EndTurnButton onClick={handleEndTurnClicked} >End turn</EndTurnButton>

            </MainDiv>
        </div>
    );
}

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    flex-direction: row;`;

const EndTurnButton = styled.button`
    width: 100px;
    padding: 5px;
    background: #eef1e3;
    border-radius: 4px;
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
`;

const BoardComponent = styled.div`
display: grid;
grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto;
background-color: #2196F3;
padding: 2px;
width: 718px;
margin: auto;
padding: 10px;
`;