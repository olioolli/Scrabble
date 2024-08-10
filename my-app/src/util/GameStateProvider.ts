import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BoardTile, GameState, LetterTile } from "../../../scrabble-backend/server";
import { BE_URL, BE_WS_URL } from "../state";
import { getCurrentPlayerName } from "./utils";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const initialGameState = {
    playerPoints: {},
    turnOfPlayer: "",
    pouchLetters: [],
    board: [],
    playerHands: {}
}

export const useGameState = () => {

    const players = useMemo( () => ["Player1", "Player2"],[]); // TODO: move to backend

    const [gameState, setGameState] = useState<GameState>(initialGameState);

    const [serverUpdatePending, setServerUpdatePending] = useState(false)

    const copyState = useCallback( (): GameState => {

        const playerPoints = {};
        const turnOfPlayer = "" + gameState.turnOfPlayer;
        const pouchLetters = [...gameState.pouchLetters];
        const board: BoardTile[][] = [];
        const playerHands: Record<string, LetterTile[]> = {};

        for(let playerName in gameState.playerPoints )
            playerPoints[playerName] = gameState.playerPoints[playerName];

        for (let i = 0; i < gameState.board.length; i++)
            board[i] = gameState.board[i].slice();

        for (let i in gameState.playerHands)
            playerHands[i] = gameState.playerHands[i].slice();

        return {
            playerPoints,
            turnOfPlayer,
            pouchLetters,
            board,
            playerHands
        }
    },[gameState]);

    const fetchGameStateFromBe = useCallback(() => {
        axios.get(BE_URL + "/game").then((resp) => {
            setGameState(resp.data);
        })
    }, []);

    const sendGameStateToBE = async (state: GameState) => {
        setServerUpdatePending(true)
        const resp = await axios.post(BE_URL + "/game", { game: state });
        setGameState(resp.data);
    };

    const sendNewGameRequest = async() => {
        const resp = await axios.get(BE_URL + "/newgame");
    };

    const keepAliveInterval = 15000;

    function startKeepAlive(client) {
        setInterval(function() {
            if (client.readyState === client.OPEN) {
                client.send({});
            }
        }, keepAliveInterval);
    }

    useEffect(() => {

        let client = new W3CWebSocket(BE_WS_URL);
        startKeepAlive(client);

        client.onopen = () => {};

        client.onmessage = (message) => {

            console.log('received message on ', new Date())

            const newGameState = JSON.parse(message.data as string);
            if (newGameState)
                setGameState(newGameState);

            setServerUpdatePending(false)
        };

        client.onerror = (error) => console.log(error)

        fetchGameStateFromBe();

        return () => {
            client.close();
        };
    }, [fetchGameStateFromBe]);

    const getPlayers = (): string[] => Object.keys(gameState.playerHands);

    const fillPlayerHand = (gs : GameState, playerName : string) => {
        const playerHand = gs.playerHands[playerName];
        while( playerHand.length < 7 && gs.pouchLetters.length !== 0 ) {

            const idx = Math.floor((Math.random() * gs.pouchLetters.length));
            const newLetter = gs.pouchLetters[idx];
            playerHand.push(newLetter);
            gs.pouchLetters.splice(idx,1);
        }
    };

    const togglePlayerTurn = useCallback(async () => {
        const gameStateCopy = copyState();
        const nextPlayer = getNextPlayer();
        gameStateCopy.turnOfPlayer = nextPlayer;
        fillPlayerHand(gameStateCopy, getCurrentPlayerName());
        await sendGameStateToBE(gameStateCopy);
    }, [copyState, players]);

    const getNextPlayer = () => {
        const players = getPlayers();
        let currentPlayerIdx = players.findIndex( (player) => player === gameState.turnOfPlayer );
        currentPlayerIdx++;
        if( currentPlayerIdx >= players.length )
            currentPlayerIdx = 0;
        return players[currentPlayerIdx];
    }

    const moveLetterToPouchFromHand = async (letter: LetterTile) => {
        const gameStateCopy = copyState();

        //make sure letter was in hand, prevent board->pouch movement
        if( gameStateCopy.playerHands[getCurrentPlayerName()].findIndex( (handLetter) => handLetter.id === letter.id ) === -1 )
            return;
            
        const idx = gameStateCopy.playerHands[getCurrentPlayerName()].findIndex(l => l.id === letter.id);
        gameStateCopy.playerHands[getCurrentPlayerName()].splice(idx, 1);
        gameStateCopy.pouchLetters.push(letter);
        await sendGameStateToBE(gameStateCopy);
    };

    const moveLetterToHandFromPouch = async (letter: LetterTile) => {
        const idx = gameState.pouchLetters.findIndex((pouchLetter) => pouchLetter.id === letter.id);
        if (idx === -1) return;

        const gameStateCopy = copyState();
        gameStateCopy.pouchLetters.splice(idx, 1);
        gameStateCopy.playerHands[getCurrentPlayerName()].push(letter);

        await sendGameStateToBE(gameStateCopy);
    }

    const removeTileFromPlayerHand = (hand: LetterTile[], letterTile: LetterTile) => {
        if (!hand || hand.length === 0) return;

        const tileIdx = hand.findIndex((tile, idx) => tile.id === letterTile.id);
        if (tileIdx === -1) return;

        hand.splice(tileIdx, 1);
    }

    const moveLetterFromHandToBoard = async (letterTile: LetterTile, x: number, y: number) => {
        const stateCopy = copyState();

        // update board
        stateCopy.board[x][y].letter = letterTile.letter;
        stateCopy.board[x][y].points = letterTile.points;
        stateCopy.board[x][y].letterTile = letterTile;

        //update hand
        removeTileFromPlayerHand(stateCopy.playerHands[getCurrentPlayerName()], letterTile);

        await sendGameStateToBE(stateCopy);
    }

    const getLetterPosition = (letterTile : LetterTile) => {
        for(let i = 0; i < gameState.board.length; i++) 
            for(let j = 0; j < gameState.board.length; j++)
                if( gameState.board[i][j].letterTile?.id === letterTile.id )
                    return { x: i, y: j };

        return null;
    };

    const moveLetterFromBoardToBoard = async (letterTile : LetterTile, x : number, y : number) => {
        const stateCopy = copyState();

        const oldPosition = getLetterPosition(letterTile);
        if( oldPosition === null ) return;

        // update new pos
        stateCopy.board[x][y].letter = letterTile.letter;
        stateCopy.board[x][y].points = letterTile.points;
        stateCopy.board[x][y].letterTile = letterTile;
        // clear old pos
        stateCopy.board[oldPosition.x][oldPosition.y].letter = undefined;
        stateCopy.board[oldPosition.x][oldPosition.y].points = undefined;
        stateCopy.board[oldPosition.x][oldPosition.y].letterTile = null;

        await sendGameStateToBE(stateCopy);
    };

    const moveLetterFromBoardToHand = async (letterTile : LetterTile) => {
        const stateCopy = copyState();

        const oldPosition = getLetterPosition(letterTile);
        if( oldPosition === null ) return;

        // clear old pos
        stateCopy.board[oldPosition.x][oldPosition.y].letter = undefined;
        stateCopy.board[oldPosition.x][oldPosition.y].points = undefined;
        stateCopy.board[oldPosition.x][oldPosition.y].letterTile = null;

        stateCopy.playerHands[getCurrentPlayerName()].push(letterTile);
        await sendGameStateToBE(stateCopy);
    };

    const updatePlayerPoints = async (playerName : string, newPoints : number) => {
        const stateCopy = copyState();
        stateCopy.playerPoints[playerName] = newPoints;
        await sendGameStateToBE(stateCopy);
    }

    return {
        gameState: gameState,
        serverUpdatePending,
        setGameState: setGameState,
        fetchGameStateFromBe: fetchGameStateFromBe,
        moveLetterToHandFromPouch: moveLetterToHandFromPouch,
        sendGameStateToBE: sendGameStateToBE,
        moveLetterFromHandToBoard,
        togglePlayerTurn,
        getPlayers,
        moveLetterToPouchFromHand,
        updatePlayerPoints,
        moveLetterFromBoardToBoard,
        moveLetterFromBoardToHand,
        sendNewGameRequest
    }
}