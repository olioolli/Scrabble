import axios from "axios";
import { useCallback, useEffect, useState } from "react";
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

    const players = ["Player1", "Player2"]; // TODO: move to backend

    const [gameState, setGameState] = useState<GameState>(initialGameState);

    const copyState = (): GameState => {

        const playerPoints = {};
        const turnOfPlayer = "" + gameState.turnOfPlayer;
        const pouchLetters = [...gameState.pouchLetters];
        const board: BoardTile[][] = [];
        const playerHands: Record<string, LetterTile[]> = {};

        for(var i = 0; i < gameState.playerPoints.length; i++)
            playerPoints[i] = gameState.playerPoints[i];

        for (var i = 0; i < gameState.board.length; i++)
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
    }

    const fetchGameStateFromBe = useCallback(() => {
        axios.get(BE_URL + "/game").then((resp) => {
            setGameState(resp.data);
        })
    }, []);

    const sendGameStateToBE = async (state: GameState) => {
        const resp = await axios.post(BE_URL + "/game", { game: state });
        setGameState(resp.data);
    };

    useEffect(() => {

        let client = new W3CWebSocket(BE_WS_URL);

        client.onopen = () => {};

        client.onmessage = (message) => {

            const newGameState = JSON.parse(message.data as string);
            if (newGameState)
                setGameState(newGameState);
        };

        fetchGameStateFromBe();
    }, [fetchGameStateFromBe]);

    const getPlayers = (): string[] => players;

    const togglePlayerTurn = useCallback(async () => {
        const gameStateCopy = copyState();
        const nextPlayer = gameStateCopy.turnOfPlayer === players[0] ? players[1] : players[0];
        gameStateCopy.turnOfPlayer = nextPlayer;
        await sendGameStateToBE(gameStateCopy);
    }, [gameState, copyState]);

    const moveLetterToPouchFromHand = async (letter: LetterTile) => {
        const gameStateCopy = copyState();

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

        //update hand
        removeTileFromPlayerHand(stateCopy.playerHands[getCurrentPlayerName()], letterTile);

        await sendGameStateToBE(stateCopy);
    }

    const updatePlayerPoints = async (playerName : string, newPoints : number) => {
        const stateCopy = copyState();
        stateCopy.playerPoints[playerName] = newPoints;
        await sendGameStateToBE(stateCopy);
    }

    return {
        gameState: gameState,
        setGameState: setGameState,
        fetchGameStateFromBe: fetchGameStateFromBe,
        moveLetterToHandFromPouch: moveLetterToHandFromPouch,
        sendGameStateToBE: sendGameStateToBE,
        moveLetterFromHandToBoard,
        togglePlayerTurn,
        getPlayers,
        moveLetterToPouchFromHand,
        updatePlayerPoints
    }
}