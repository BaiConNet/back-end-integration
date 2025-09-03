const mongoose = require("mongoose");

exports.healthCheck = (req, res) => {
  // Calcular uptime formatado
  const seconds = Math.floor(process.uptime());
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  res.status(200).json({
    status: "ok",
    service: "api-barbeiro",
    env: process.env.NODE_ENV || "development",
    version: "1.0.0",
    uptime: {
      hours,
      minutes: minutes % 60,
      seconds: seconds % 60,
    },
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    memoryUsage: process.memoryUsage(),
    config: {
      mongoUri: !!process.env.MONGO_URI,
      jwtSecret: !!process.env.JWT_SECRET,
    }
  });
};
