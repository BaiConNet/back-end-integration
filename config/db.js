const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado ao MongoDB Atlas');
  } catch (err) {
    console.error('Erro ao conectar com MongoDB:', err);
    process.exit(1);
  }
};

module.exports = conectarDB;
