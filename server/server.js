import express from "express"
import { Server } from "socket.io"
import { createServer } from 'http'

const app = express();
const server = createServer(app);
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
        socket.broadcast.emit("recieve-message", data);
    })

    socket.on("disconnect", () => {
        console.log('socket disconnected: ', socket.id);
    })
});

app.get("/", (req, res) => {
    res.send("hello world!");
});

server.listen(3000, () => {
    console.log('server listening on port 3000!');
});