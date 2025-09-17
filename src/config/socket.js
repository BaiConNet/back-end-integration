const { Server } = require("socket.io");

let io;
const connectedUsers = new Map();

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://sandbox-admin-control-jwtsh.vercel.app",
        "https://admin-control-jwtsh.vercel.app",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Novo cliente conectado:", socket.id);

    socket.on("register", (userId) => {
      connectedUsers.set(userId, socket.id);
      console.log(`Usuário ${userId} registrado com socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (let [key, value] of connectedUsers.entries()) {
        if (value === socket.id) connectedUsers.delete(key);
      }
      console.log("Cliente desconectado:", socket.id);
    });
  });
}

function sendNotificationToUser(userId, notification) {
  const socketId = connectedUsers.get(userId);
  if (socketId && io) {
    io.to(socketId).emit("new_notification", notification);
  }
}

module.exports = { initSocket, sendNotificationToUser };
