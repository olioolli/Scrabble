import { useState } from 'react';
import styled from 'styled-components';
import { BoardTileComponent, TileDropType } from './BoardTileComponent';
import { HandComponent } from './HandComponent';
import { PouchComponent } from './PouchComponent';
import { LetterTile } from '../../../scrabble-backend/server';
import { getCurrentPlayerName, isMobileScreenWidth } from '../util/utils';
import { useGameState } from '../util/GameStateProvider';
import { useCallback } from 'react';
import { PlayerInfo } from './PlayerInfoComponent';
import { DialogComponent } from './DialogComponent';
import { PlayerInfoPopupComponent } from './PlayerInfoPopupComponent';

export const GameBoardComponent = () => {

    const { gameState, 
        serverUpdatePending,
        moveLetterFromHandToBoard, 
        getPlayers, 
        togglePlayerTurn, 
        moveLetterToPouchFromHand,
        updatePlayerPoints,
        moveLetterFromBoardToBoard,
        moveLetterFromBoardToHand,
        sendNewGameRequest } = useGameState();

    const [ isPopupVisible, setPopupVisible ] = useState(false);
    const [ selectedLetterTile, setSelectedLetterTile ] = useState<LetterTile|undefined>();
    const [ openWndPlayerName, setOpenWndPlayerName ] = useState<string|undefined>();

    const isMobile = isMobileScreenWidth();

    const handleLetterTileDrop = async (letterTile: LetterTile,dropType: TileDropType, x: number, y: number, newX?: number, newY?: number) => {
        if (dropType === TileDropType.HAND_TO_POUCH )
            await moveLetterToPouchFromHand(letterTile);
        else if( dropType === TileDropType.HAND_TO_BOARD )
            await moveLetterFromHandToBoard(letterTile, x, y);
        else if( dropType == TileDropType.BOARD_TO_HAND )
            await moveLetterFromBoardToHand(letterTile);
        else
            await moveLetterFromBoardToBoard(letterTile, x, y);
        
        setSelectedLetterTile(undefined)
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
            {openWndPlayerName && 
                <PlayerInfoPopupComponent 
                    pointsUpdated={handlePointsUpdated} 
                    name={openWndPlayerName} 
                    points={gameState.playerPoints[openWndPlayerName]}
                    setOpenWndPlayerName={setOpenWndPlayerName}></PlayerInfoPopupComponent>}
            <MainDiv>
                {
                    serverUpdatePending ? <InactivePlayerBlocker backgroundColor="762f2f" /> :
                    isCurrentPlayerActive() ? <></> : <InactivePlayerBlocker>Not your turn</InactivePlayerBlocker>
                }
                <div className='board'>
                    {gameState.board.map((x, y) => (
                        x.map((tile, i) => (
                            <BoardTileComponent
                                key={i}
                                letterTile={ tile.letterTile }
                                tileXPos={y}
                                tileYPos={i}
                                tileDropped={handleLetterTileDrop}
                                selectedLetterTile={selectedLetterTile}
                                setSelectedLetterTile={setSelectedLetterTile}
                                tileType={tile.tileType}>
                            </BoardTileComponent>))
                    ))}
                </div>

                <div className='rightPanel'>
                    <div className='playerContainer'>
                    {getPlayers().map(player => (
                        <PlayerInfo isActive={gameState.turnOfPlayer === player} 
                        key={player} 
                        points={gameState.playerPoints[player]} 
                        name={player} 
                        pointsUpdated={handlePointsUpdated}
                        playerInfoClicked={ (playerName) => setOpenWndPlayerName(playerName)}></PlayerInfo>
                        ))}
                    </div>
                    <div className='rightPanelButtonContainer'>
                        <EndTurnButton onClick={handleEndTurnClicked} >End turn</EndTurnButton>
                        <EndTurnButton onClick={ () => { setPopupVisible(true)}}>New game</EndTurnButton>
                    </div>
                </div>
                <BottomContainer mobileMode={isMobile}>
                    <HandComponent 
                    tileDropped={handleLetterTileDrop} 
                    selectedLetterTile={selectedLetterTile}
                    setSelectedLetterTile={setSelectedLetterTile}
                    letters={gameState.playerHands[getCurrentPlayerName()] !== undefined ? gameState.playerHands[getCurrentPlayerName()] : []} />
                    <PouchComponent
                        letters={gameState.pouchLetters !== undefined ? gameState.pouchLetters : []}
                        tileDropped= {handleLetterTileDrop}
                        selectedLetterTile={selectedLetterTile}
                        setSelectedLetterTile={setSelectedLetterTile}
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
  background: ${({ backgroundColor }) => backgroundColor || '#762f2f00'};
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0.6;
`;

const BottomContainer = styled.div`
	display: flex;
	justify-content: center;
    margin-top: 10px;
    flex-wrap: wrap;
    flex-direction: ${props => props.mobileMode ? 'column' : 'initial'};
    align-items: ${props => props.mobileMode ? 'center' : 'initial'};
`;