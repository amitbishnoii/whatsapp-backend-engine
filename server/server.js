import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { configDotenv } from "dotenv";
import connection from "./config/db.js";
import initSocket from "./sockets/index.js";
import userRouter from "./routes/userRoutes.js";

configDotenv();
await connection();

const app = express();
const server = createServer(app);
app.use(express.json());
app.use("/user", userRouter);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

initSocket(io);

app.get("/", (req, res) => {
    res.send("hello world!");
});

server.listen(3000, () => {
    console.log("server listening on port 3000!");
});
