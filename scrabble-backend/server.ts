// Importing module
import express from 'express';
import cors from 'cors';
import * as WebSocket from 'ws';
import * as http from 'http';

const app = express();
const PORT: Number = 5000;
const WS_PORT = 443
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

server.listen(process.env.PORT || WS_PORT, () => {
    console.log("Listening...");
});

const broadCastGameState = () => {
    console.log('Broadcasting game')
    wss.clients.forEach((ws) => {
        const extWs = ws as ExtWebSocket;
        console.log('sending game data through WS..')
        extWs.send(JSON.stringify(gameState));
    });
};

// Handling GET / Request
app.get('/', (_, res) => {
    res.send('Welcome to Scabble backend!');
})

// Server setup
app.listen(PORT, () => {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
})

app.post("/login", (req, res) => {
    if (req.body.username) {
        if (!addUser(req.body.username)) {
            res.sendStatus(400);
            return;
        }
        else {
            res.sendStatus(200);
            broadCastGameState();
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
    console.log('/game: Game received')
    gameState = req.body.game;
    broadCastGameState();
    res.status(200).json(gameState);
});

app.get("/game", (_, res) => {
    res.send(JSON.stringify(gameState));
});

app.get("/users", (_, res) => {
    res.send(JSON.stringify(users));
});

app.get("/reset", (_, res) => {
    gameState = createInitialGameState(false);
    users = [];
    res.send("Game reset");
});

app.get("/newgame", (_, res) => {
    gameState = createInitialGameState(true);
    broadCastGameState();
    res.send("New game started");
});

const addUser = (username: string) => {
    if (getUser(username))
        return false;

    users.push(username);
    
    if( gameState.turnOfPlayer === '' )
        gameState.turnOfPlayer = username;
    
    gameState.playerPoints[username] = 0;
    gameState.playerHands[username] = getRandomStartingHand();
    if( gameState.turnOfPlayer === '' )
        gameState.turnOfPlayer = username;
    return true;
}

const getUser = (username: string) => {
    for (let user of users)
        if (user === username)
            return user;

    return undefined;
}

let users: string[] = [];

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

const createPouchLetters = () => {
    return [
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
}

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

const getRandomStartingHand = () => {
    const retArr = [];
    for(let i = 0; i < 7; i++) {
        const idx = Math.floor((Math.random() * gameState.pouchLetters.length));
        retArr.push(...gameState.pouchLetters.splice(idx,1));
    }
    return retArr;
}

let gameBoard = generateEmptyGameBoard();

const createInitialGameState = (retainPlayerData : boolean) : GameState => {

    const newGameState : GameState = {
        playerPoints: {},
        turnOfPlayer: retainPlayerData ? gameState.turnOfPlayer : '',
        pouchLetters: createPouchLetters(),
        playerHands: {},
        board: gameBoard
    };

    if( retainPlayerData ) {
        users.forEach( username => {
            newGameState.playerHands[username] = getRandomStartingHand();
            newGameState.playerPoints[username] = 0;
        });
        newGameState.turnOfPlayer = gameState.turnOfPlayer;
    }

    return newGameState;
}

let gameState = createInitialGameState(false);