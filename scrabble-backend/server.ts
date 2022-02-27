// Importing module
import express from 'express';
import { send } from 'process';
import cors from 'cors';
import * as WebSocket from 'ws';
import * as http from 'http';

const app = express();
const PORT: Number = 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

interface ExtWebSocket extends WebSocket {
    isAlive : boolean;
}

wss.on('connection', (ws : ExtWebSocket) => {

    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (message: string) => { 
       if( message === "gamestate" ) {

       }
       
       ws.send(`Received message: ${message}`);
    });
});

server.listen(process.env.PORT || 8999, () => {
    console.log("Listening...");
});

setInterval(() => {
    wss.clients.forEach((ws) => {
        const extWs = ws as ExtWebSocket;
        if (!extWs.isAlive) return extWs.terminate();
        
        extWs.isAlive = false;
        extWs.ping(null, false);
    });
}, 10000);

const broadCastGameState = () => {
    wss.clients.forEach((ws) => {
        const extWs = ws as ExtWebSocket;
        if (!extWs.isAlive) return;
        extWs.send(JSON.stringify(gameState));
    });
};

// Handling GET / Request
app.get('/', (req, res) => {
    res.send('Welcome to typescript backend!');
})

// Server setup
app.listen(PORT, () => {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
})

app.post("/login", (req, res) => {
    if (!req.body.password || req.body.password !== password) {
        res.sendStatus(401);
        return;
    }

    if (req.body.username) {
        if (!addUser(req.body.username)) {
            res.sendStatus(400);
            return;
        }
        else {
            res.sendStatus(200);
            return;
        }
    }
    res.send(500);
});

app.get("/isLoggedIn", (req, res) => {
    try {
        const username = req.query.username as string;
        const result = getUser(username) != undefined;
        res.send(JSON.stringify({ isLoggedIn: result }));
    }
    catch (err) {
        res.send(JSON.stringify({ isLoggedIn: false }));
    }
});

app.post("/game", (req, res) => {
    gameState = req.body.game;
    broadCastGameState();
    res.status(200).json(gameState);
});

app.get("/game", (req, res) => {
    res.send(JSON.stringify(gameState));
});

app.get("/users", (req, res) => {
    res.send(JSON.stringify(users));
});

app.get("/reset", (req, res) => {
    gameState = initialGameState;
    res.send("Game reset");
});

const addUser = (username: string) => {
    if (getUser(username))
        return false;

    users.push(username);
    return true;
}

const getUser = (username: string) => {
    for (let user of users)
        if (user === username)
            return user;

    return undefined;
}

const password = "kala";
const users: string[] = [];

export enum TileType {
    N0R = 0,
    X2W = 1,
    X3W = 2,
    X2L = 3,
    X3L = 4,
    CNT = 5
}

const getTileTypeFromNumber = (id: number) => {
    if (id === 0)
        return TileType.N0R;
    else if (id === 1)
        return TileType.X2W;
    else if (id === 2)
        return TileType.X3W;
    else if (id === 3)
        return TileType.X2L;
    else if (id === 4)
        return TileType.X3L;
    else if (id === 5)
        return TileType.CNT;

    return N0R;
}

let letterTileIdCounter = 0;

export type LetterTile = {
    letter: string,
    points : number,
    owner: string
    id: number
}

const createNewLetterTile = (character: string, points : number, owner : string) => {
    return {
        letter: character,
        points: points,
        owner : owner,
        id : letterTileIdCounter++
    }
}

const createNewLettersTiles = (character: string, points : number, count : number) : LetterTile[] => {
    let retArr = [];
    for(let i =0; i < count; i++)
        retArr.push(createNewLetterTile(character,points,""));
    return retArr;
}
/*
const pouchLetters = [
    ...createNewLettersTiles("A",1,11),
    ...createNewLettersTiles("D",7,1),
    ...createNewLettersTiles("E",1,13),
    ...createNewLettersTiles("G",8,1),
    ...createNewLettersTiles("H",4,3),
    ...createNewLettersTiles("I",1,10),
    ...createNewLettersTiles("J",4,2),
    ...createNewLettersTiles("K",2,4),
    ...createNewLettersTiles("L",2,3),
    ...createNewLettersTiles("M",3,2),
    ...createNewLettersTiles("N",1,6),
    ...createNewLettersTiles("O",2,8),
    ...createNewLettersTiles("P",4,2),
    ...createNewLettersTiles("R",4,4),
    ...createNewLettersTiles("S",1,5),
    ...createNewLettersTiles("T",1,6),
    ...createNewLettersTiles("U",3,5),
    ...createNewLettersTiles("V",4,2),
    ...createNewLettersTiles("Y",4,2),
    ...createNewLettersTiles("-",0,2),
    ...createNewLettersTiles("Ä",2,3),
    ...createNewLettersTiles("Ö",3,2),
];
*/
const pouchLetters = [
    ...createNewLettersTiles("A",1,6),
    ...createNewLettersTiles("D",7,1),
    ...createNewLettersTiles("E",1,3),
    ...createNewLettersTiles("G",8,1),
    ...createNewLettersTiles("H",4,3),
    ...createNewLettersTiles("I",1,3),
    ...createNewLettersTiles("J",4,1),
    ...createNewLettersTiles("K",2,2),
    ...createNewLettersTiles("L",2,2),
    ...createNewLettersTiles("M",3,1),
    ...createNewLettersTiles("N",1,3),
    ...createNewLettersTiles("O",2,4),
    ...createNewLettersTiles("P",4,1),
    ...createNewLettersTiles("R",4,2),
    ...createNewLettersTiles("S",1,2),
    ...createNewLettersTiles("T",1,3),
    ...createNewLettersTiles("U",3,2),
    ...createNewLettersTiles("V",4,1),
    ...createNewLettersTiles("Y",4,1),
    ...createNewLettersTiles("-",0,1),
    ...createNewLettersTiles("Ä",2,1),
    ...createNewLettersTiles("Ö",3,1),
];

export type BoardTile = {
    tileType: TileType,
    letter: string | undefined,
    points: number | undefined,
    // Placed letter is temp until turn passed
    isTemp: boolean
    letterTile : LetterTile | null
}

export type GameState = {
    playerPoints : Record<string,number>,
    turnOfPlayer : string,
    pouchLetters: LetterTile[]
    board : BoardTile[][],
    playerHands: Record<string, LetterTile[]>
}

const N0R = 0,
    X2W = 1,
    X3W = 2,
    X2L = 3,
    X3L = 4,
    CNT = 5;

let gameBoardTemplate =
    [
        [X3W, N0R, N0R, X2W, N0R, N0R, N0R, X3W, N0R, N0R, X2W, N0R, N0R, N0R, X3W],
        [N0R, X2W, N0R, N0R, N0R, X3L, N0R, N0R, N0R, X3L, N0R, N0R, N0R, X2W, N0R],
        [N0R, N0R, X2W, N0R, N0R, N0R, X2L, N0R, X2L, N0R, N0R, N0R, X2W, N0R, N0R],
        [N0R, N0R, N0R, X2W, N0R, N0R, N0R, X2L, N0R, N0R, N0R, X2W, N0R, N0R, N0R],
        [N0R, N0R, N0R, N0R, X2W, N0R, N0R, N0R, N0R, N0R, X2W, N0R, N0R, N0R, N0R],
        [N0R, X3L, N0R, N0R, N0R, X3L, N0R, N0R, N0R, X3L, N0R, N0R, N0R, X3L, N0R],
        [N0R, N0R, X2L, N0R, N0R, N0R, X2L, N0R, X2L, N0R, N0R, N0R, X2L, N0R, N0R],
        [X3W, N0R, N0R, X2L, N0R, N0R, N0R, CNT, N0R, N0R, N0R, X2L, N0R, N0R, X3W],
        [N0R, N0R, X2L, N0R, N0R, N0R, X2L, N0R, X2L, N0R, N0R, N0R, X2L, N0R, N0R],
        [N0R, X3L, N0R, N0R, N0R, X3L, N0R, N0R, N0R, X3L, N0R, N0R, N0R, X3L, N0R],
        [N0R, N0R, N0R, N0R, X2W, N0R, N0R, N0R, N0R, N0R, X2W, N0R, N0R, N0R, N0R],
        [N0R, N0R, N0R, X2W, N0R, N0R, N0R, X2L, N0R, N0R, N0R, X2W, N0R, N0R, N0R],
        [N0R, N0R, X2W, N0R, N0R, N0R, X2L, N0R, X2L, N0R, N0R, N0R, X2W, N0R, N0R],
        [N0R, X2W, N0R, N0R, N0R, X3L, N0R, N0R, N0R, X3L, N0R, N0R, N0R, X2W, N0R],
        [X3W, N0R, N0R, N0R, N0R, N0R, N0R, X3W, N0R, N0R, N0R, N0R, N0R, N0R, X3W]
    ]

const generateEmptyGameBoard = () => {

    const board: BoardTile[][] = [];

    for (let x = 0; x < 15; x++) {
        const arr: BoardTile[] = [];
        board[x] = arr;
        for (let y = 0; y < 15; y++) {
            const tileType = gameBoardTemplate[x][y];
            arr.push({
                tileType: getTileTypeFromNumber(tileType),
                letter: undefined,
                isTemp: false,
                points: undefined,
                letterTile : null
            });
        }
    }

    return board;
};

let gameBoard = generateEmptyGameBoard();
const initialGameState : GameState = {
    playerPoints: {
        "Player1" : 0,
        "Player2" : 0
    },
    turnOfPlayer: "Player1",
    pouchLetters: pouchLetters,

    playerHands: {
        "Player1" : [],
        "Player2": []
    },
    board: gameBoard
};
let gameState = initialGameState;