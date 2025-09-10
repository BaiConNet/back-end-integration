const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const conectarDB = async () => {
  try {
    let uri;

    switch (process.env.NODE_ENV) {
      case 'sandbox':
        uri = process.env.MONGO_URI_SANDBOX;
        console.log('🔹 Conectando ao MongoDB Sandbox...');
        break;

      case 'production':
        uri = process.env.MONGO_URI;
        console.log('🔹 Conectando ao MongoDB Produção...');
        break;
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB Atlas');
  } catch (err) {
    console.error('Erro ao conectar com MongoDB:', err);
    process.exit(1);
  }
};

module.exports = conectarDB;
