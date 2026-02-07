import { addUser, removeUser } from "./presence.js";
import { handleMessaging } from "./messaging.js";

export default function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    socket.on("connect-user", (userID) => {
      socket.userId = userID;
      const firstOnline = addUser(userID, socket.id);

      if (firstOnline) {
        socket.broadcast.emit("user-online", {
          uid: userID,
        });
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
