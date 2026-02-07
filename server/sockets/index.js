import { addUser, removeUser } from "./presence.js";
import { handleMessaging } from "./messaging.js";

export default function initSocket(io) {
    io.on("connection", (socket) => {
        console.log("user connected:", socket.id);
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            console.log('nothing in userId bro you are cooked!');
        }

        const firstOnline = addUser(userId, socket.id);
        socket.userId = userId;
        if (firstOnline) {
            socket.broadcast.emit("user-online", {
                uid: userId,
            });
        }

        handleMessaging(io, socket);

        socket.on("disconnect", () => {
            const offlineUser = removeUser(socket.id);

            if (offlineUser) {
                socket.broadcast.emit("user-offline", offlineUser);
            }

            console.log("socket disconnected:", socket.id);
        });
    });
}
