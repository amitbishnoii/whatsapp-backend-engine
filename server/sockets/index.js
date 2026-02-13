import { addUser, getUserSockets, removeUser } from "./presence.js";
import { handleMessaging } from "./messaging.js";
import User from "../models/userModel.js";

export default function initSocket(io) {
    io.on("connection", (socket) => {
        console.log("user connected:", socket.id);
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            console.log('nothing in userId bro you are cooked!');
        }

        socket.userId = userId;

        socket.on("connect-user", async (userID) => {
            try {
                const firstOnline = addUser(userId, socket.id);

                const user = await User.findOne({ username: userId });
                if (!user) return;

                const friendUsernames = user.friends || [];

                if (firstOnline) {
                    friendUsernames.forEach(friend => {
                        const socketSet = getUserSockets(friend);
                        if (!socketSet) return;

                        for (const sId of socketSet) {
                            io.to(sId).emit("user-online", {
                                uid: userId,
                            });
                        }
                    });
                }
            } catch (err) {
                console.error("presence error:", err);
            }
        });

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
