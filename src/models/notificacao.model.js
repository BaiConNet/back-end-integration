const mongoose = require("mongoose");

const notificacaoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mensagem: { type: String, required: true },
    lida: { type: Boolean, default: false },
    criadoEm: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notificacao", notificacaoSchema);
