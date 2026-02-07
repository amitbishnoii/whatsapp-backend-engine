import { getUserSockets } from "./presence.js";

export function handleMessaging(io, socket) {
  socket.on("send-message", (data) => {
    const socketSet = getUserSockets(data.recID);
    if (!socketSet) return;

    for (const socketId of socketSet) {
      io.to(socketId).emit("receive-message", data.message);
    }
  });

  socket.on("typing:start", (user) => {
    if (!user.recID) return;

    const socketSet = getUserSockets(user.recID);
    if (!socketSet) return;

    for (const socketId of socketSet) {
      io.to(socketId).emit("typing-start", user.userID);
    }
  });

  socket.on("typing:stop", (userID) => {
    socket.broadcast.emit("typing-stop", userID);
  });
}
