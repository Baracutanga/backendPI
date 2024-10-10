const mongoose = require("mongoose");

const disciplinaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  turmas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Turma" }] // 
}, {
  timestamps: true
});

// Exportando o modelo de disciplina
module.exports = mongoose.model("Disciplina", disciplinaSchema);
