import { getUserSockets } from "./presence.js";

export function handleMessaging(io, socket) {
    socket.on("send-message", (data) => {
        const socketSet = getUserSockets(data.recID);
        console.log('we got send message fired: ', data.recID);
        if (!socketSet) {
            console.log('socket set is empty');
            return;
        }

        for (const socketId of socketSet) {
            io.to(socketId).emit("receive-message", data.message);
        }
    });

    socket.on("typing:start", (user) => {
        if (!user.recID) return;

        const socketSet = getUserSockets(user.recID);
        if (!socketSet) return;

        for (const socketId of socketSet) {
            io.to(socketId).emit("typing-start", socket.userId);
        }
    });

    socket.on("typing:stop", () => {
        socket.broadcast.emit("typing-stop", socket.userId);
    });
}
