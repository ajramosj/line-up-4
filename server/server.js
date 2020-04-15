const express = require("express")
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')

const port = process.env.PORT || 0;

/* Database */
var users = [];

/* Express */
const app = express();

app.use(bodyParser.json());

// API
app.get("/id", (req, res) => {
    let id = users.length + 1;
    users.push({ id: id, socket: null, opponentId: null });
    res.send({ id: id });
});
app.post("/opponent", async (req, res) => {
    if (req.body.opponentId <= users.length && req.body.opponentId >= 0 && req.body.opponentId != req.body.id) {
        users[req.body.id - 1].opponentId = req.body.opponentId;
        res.status(200).end();
    } else {
        res.status(404).end();
    }
});

// App
app.use(express.static('dist/app'));
app.get('/', (req, res) => res.sendFile(path.resolve('dist/app/index.html')));

/* Server */

const server = http.createServer(app);

server.listen(port, () => console.log("Server listening on port " + port));

/* Socket.io */

const io = socketIo(server);

io.on('connection', function (socket) {
    socket.on('id', function (data) {
        let user = users[data - 1];
        user.socket = socket;

        // Find opponent
        if (user.opponentId == 0) {     // Player who waits and has already been invited
            for (let i = 0; i < users.length; i++) {
                if (users[i].opponentId == user.id) {
                    // Assign opponent to this player
                    user.opponentId = users[i].id

                    // First player will be random
                    let firstPlayerId;
                    Math.random() > 0.5 ? firstPlayerId = user.id : firstPlayerId = user.opponentId;

                    // Start game on both clients
                    users[i].socket.emit('game', { opponentId: user.id, firstPlayerId: firstPlayerId })
                    user.socket.emit('game', { opponentId: user.opponentId, firstPlayerId: firstPlayerId })
                }
            }
        } else {        // Player who invites and their opponent has already been waiting
            if (users[user.opponentId - 1].socket) {
                // Assign opponent (this player) to the opponent
                users[user.opponentId - 1].opponentId = user.id;

                // First player will be random
                let firstPlayerId;
                Math.random() > 0.5 ? firstPlayerId = user.id : firstPlayerId = user.opponentId;

                // Start game on both clients
                users[user.opponentId - 1].socket.emit('game', { opponentId: user.id, firstPlayerId: firstPlayerId })
                user.socket.emit('game', { opponentId: user.opponentId, firstPlayerId: firstPlayerId })
            }
        }
    });
    socket.on('move', function (data) {
        socket.emit('move', { playerId: data.id, hole: data.hole });
        users[users[data.id - 1].opponentId - 1].socket.emit('move', { playerId: data.id, hole: data.hole })
    });
    //socket.on('disconnect', function () { });
});