"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TileType = void 0;
// Importing module
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var WebSocket = __importStar(require("ws"));
var http = __importStar(require("http"));
var app = (0, express_1.default)();
var PORT = 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
//initialize a simple http server
var server = http.createServer(app);
//initialize the WebSocket server instance
var wss = new WebSocket.Server({ server: server });
wss.on('connection', function (ws) {
    ws.isAlive = true;
    ws.on('pong', function () {
        ws.isAlive = true;
    });
    ws.on('message', function (message) {
        if (message === "gamestate") {
        }
        ws.send("Received message: ".concat(message));
    });
});
server.listen(process.env.PORT || 8999, function () {
    console.log("Listening...");
});
setInterval(function () {
    wss.clients.forEach(function (ws) {
        var extWs = ws;
        if (!extWs.isAlive)
            return extWs.terminate();
        extWs.isAlive = false;
        extWs.ping(null, false);
    });
}, 10000);
var broadCastGameState = function () {
    wss.clients.forEach(function (ws) {
        var extWs = ws;
        if (!extWs.isAlive)
            return;
        extWs.send(JSON.stringify(gameState));
    });
};
// Handling GET / Request
app.get('/', function (req, res) {
    res.send('Welcome to typescript backend!');
});
// Server setup
app.listen(PORT, function () {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
});
app.post("/login", function (req, res) {
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
app.get("/isLoggedIn", function (req, res) {
    try {
        var username = req.query.username;
        var result = getUser(username) != undefined;
        res.send(JSON.stringify({ isLoggedIn: result }));
    }
    catch (err) {
        res.send(JSON.stringify({ isLoggedIn: false }));
    }
});
app.post("/game", function (req, res) {
    gameState = req.body.game;
    broadCastGameState();
    res.status(200).json(gameState);
});
app.get("/game", function (req, res) {
    res.send(JSON.stringify(gameState));
});
app.get("/users", function (req, res) {
    res.send(JSON.stringify(users));
});
app.get("/reset", function (req, res) {
    gameState = initialGameState;
    res.send("Game reset");
});
var addUser = function (username) {
    if (getUser(username))
        return false;
    users.push(username);
    return true;
};
var getUser = function (username) {
    for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
        var user = users_1[_i];
        if (user === username)
            return user;
    }
    return undefined;
};
var password = "kala";
var users = [];
var TileType;
(function (TileType) {
    TileType[TileType["N0R"] = 0] = "N0R";
    TileType[TileType["X2W"] = 1] = "X2W";
    TileType[TileType["X3W"] = 2] = "X3W";
    TileType[TileType["X2L"] = 3] = "X2L";
    TileType[TileType["X3L"] = 4] = "X3L";
    TileType[TileType["CNT"] = 5] = "CNT";
})(TileType = exports.TileType || (exports.TileType = {}));
var getTileTypeFromNumber = function (id) {
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
};
var letterTileIdCounter = 0;
var createNewLetterTile = function (character, points, owner) {
    return {
        letter: character,
        points: points,
        owner: owner,
        id: letterTileIdCounter++
    };
};
var createNewLettersTiles = function (character, points, count) {
    var retArr = [];
    for (var i = 0; i < count; i++)
        retArr.push(createNewLetterTile(character, points, ""));
    return retArr;
};
var pouchLetters = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], createNewLettersTiles("A", 1, 11), true), createNewLettersTiles("D", 7, 1), true), createNewLettersTiles("E", 1, 12), true), createNewLettersTiles("G", 8, 1), true), createNewLettersTiles("H", 4, 3), true), createNewLettersTiles("I", 1, 10), true), createNewLettersTiles("J", 4, 2), true), createNewLettersTiles("K", 2, 4), true), createNewLettersTiles("L", 2, 3), true), createNewLettersTiles("M", 3, 2), true), createNewLettersTiles("N", 1, 6), true), createNewLettersTiles("O", 2, 8), true), createNewLettersTiles("P", 4, 2), true), createNewLettersTiles("R", 4, 4), true), createNewLettersTiles("S", 1, 5), true), createNewLettersTiles("T", 1, 6), true), createNewLettersTiles("U", 3, 5), true), createNewLettersTiles("V", 4, 2), true), createNewLettersTiles("Y", 4, 2), true), createNewLettersTiles("-", 0, 2), true), createNewLettersTiles("Ä", 2, 3), true), createNewLettersTiles("Ö", 3, 2), true);
var N0R = 0, X2W = 1, X3W = 2, X2L = 3, X3L = 4, CNT = 5;
var gameBoardTemplate = [
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
];
var generateEmptyGameBoard = function () {
    var board = [];
    for (var x = 0; x < 15; x++) {
        var arr = [];
        board[x] = arr;
        for (var y = 0; y < 15; y++) {
            var tileType = gameBoardTemplate[x][y];
            arr.push({
                tileType: getTileTypeFromNumber(tileType),
                letter: undefined,
                isTemp: false,
                points: undefined,
                letterTile: null
            });
        }
    }
    return board;
};
var gameBoard = generateEmptyGameBoard();
var initialGameState = {
    playerPoints: {
        "Player1": 0,
        "Player2": 0
    },
    turnOfPlayer: "Player1",
    pouchLetters: pouchLetters,
    playerHands: {
        "Player1": [],
        "Player2": []
    },
    board: gameBoard
};
var gameState = initialGameState;
