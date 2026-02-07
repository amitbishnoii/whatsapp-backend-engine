const socketUserMap = new Map();

export function addUser(userID, socketId) {
    if (!socketUserMap.has(userID)) {
        socketUserMap.set(userID, new Set());
        return true;
    }
    socketUserMap.get(userID).add(socketId);
    return false;
}

export function removeUser(socketId) {
    for (const [userID, socketSet] of socketUserMap) {
        if (socketSet.has(socketId)) {
            socketSet.delete(socketId);

            if (socketSet.size === 0) {
                socketUserMap.delete(userID);
                return userID;
            }
            break;
        }
    }
    return null;
}

export function getUserSockets(userID) {
    return socketUserMap.get(userID);
}
