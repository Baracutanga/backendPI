const mongoose = require("mongoose");

const avisoSchema = new mongoose.Schema({
  nome: { type: String, required: true },  
  descricao: { type: String, required: true }, 
  turma: { type: mongoose.Schema.Types.ObjectId, ref: "Turma", required: true },  
  disciplina: { type: mongoose.Schema.Types.ObjectId, ref: "Disciplina", required: true },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } 
}, {
  timestamps: true
});


module.exports = mongoose.model("Aviso", avisoSchema);