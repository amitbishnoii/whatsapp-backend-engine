import express from "express"
import { Server } from "socket.io"
import { createServer } from 'http'

const app = express();
const server = createServer(app);
const socketUserMap = new Map();
const socketIDs = new Set();
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log('user connected: ', socket.id);
    socket.on("send-message", (data) => {
        console.log('message: ', data);
        socket.to(data.recID).emit("recieve-message", data.message);
    });

    socket.on("connect-user", (userID) => {
        if (!socketUserMap.has(userID)) {
            socketUserMap.set(userID, new Set());
        }
        const socketIdSet = socketUserMap.get(userID);
        socketIdSet.add(socket.id);
        console.log('current user map: ', socketUserMap);
    });

    socket.on("disconnect", () => {
        for (const [uID, socketSet] of socketUserMap) {
            if (socketSet.has(socket.id)) {
                socketSet.delete(socket.id);
                if (socketSet === 0) {
                    socketUserMap.delete(uID);
                }
                break;
            }
        }
        console.log('socket disconnected: ', socket.id);
    });
});

app.get("/", (req, res) => {
    res.send("hello world!");
});

server.listen(3000, () => {
    console.log('server listening on port 3000!');
});