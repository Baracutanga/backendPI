const mongoose = require("mongoose");

// Schema para notas (AV1, AV2, MU, MUPN)
const unidadeSchema = new mongoose.Schema({
  AV1: { type: Number, default: null },
  AV2: { type: Number, default: null },
  MU: { type: Number, default: null },
  MUPN1: { type: Number, default: null },
  MUPN2: { type: Number, default: null },
}, { _id: false }, { versionKey: false});

const notasAlunoSchema = new mongoose.Schema({
  aluno:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  disciplina: { type: mongoose.Schema.Types.ObjectId, ref: "Disciplina", required: true },
  unidade1: { type: unidadeSchema, default: () => ({}) },
  unidade2: { type: unidadeSchema, default: () => ({}) }, 
  unidade3: { type: unidadeSchema, default: () => ({}) }, 
  MFA: { type: Number, default: null }, // Menção final anual
  FT: { type: Number, default: 0 }, // Total de faltas
  MFAPN: { type: Number, default: null }, // Menção final anual pós NOA
  resumo: { type: String, default: null } // Resumo final do aluno
}, { versionKey: false});

  module.exports = mongoose.model("Conceito", notasAlunoSchema);
