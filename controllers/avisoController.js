const Aviso = require("../models/avisoModel");
const Turma = require("../models/turmaModel");
const Disciplina = require("../models/disciplinaModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

exports.createAviso = async (req, res) => {
  try {
    const { nome, descricao, turma, disciplina } = req.body;
    const autor = req.user.id;

    const autorExistente = await User.findById(autor);
    if (!autorExistente || autorExistente.user !== "Professor") {
      return res.status(404).json({ message: "Professor não encontrado." });
    }

    let turmaExistente;
    if (mongoose.isValidObjectId(turma)) {
      turmaExistente = await Turma.findById(disciplina);
    }

    if (!turmaExistente) {
      turmaExistente = await Turma.findOne({ nome: turma });
    }
    if (!turmaExistente) {
      return res.status(404).json({ message: "Turma não encontrada." });
    }

    let disciplinaExistente;

    if (mongoose.isValidObjectId(disciplina)) {
      disciplinaExistente = await Disciplina.findById(disciplina);
    }

    if (!disciplinaExistente) {
      disciplinaExistente = await Disciplina.findOne({ nome: disciplina });
    }

    if (!disciplinaExistente) {
      return res
        .status(404)
        .json({ message: `Disciplina não encontrada: ${disciplina}` });
    }

    const novoAviso = new Aviso({
      nome,
      descricao,
      turma: turmaExistente._id,
      disciplina: disciplinaExistente._id,
      autor,
    });

    await novoAviso.save();
    return res
      .status(201)
      .json({ message: "Aviso criado com sucesso!", aviso: novoAviso });
  } catch (error) {
    console.error("Erro ao criar aviso:", error);
    return res.status(500).json({ message: "Erro ao criar aviso", error });
  }
};

exports.createAvisoCoordenador = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const autor = req.user.id;

    const autorExistente = await User.findById(autor);
    if (!autorExistente || autorExistente.user !== "Coordenador") {
      return res.status(404).json({ message: "Coordenador não encontrado." });
    }

    const turmas = await Turma.find();

    if (!turmas.length) {
      return res.status(404).json({ message: "Nenhuma turma encontrada no banco de dados." });
    }

    // Criar o novo aviso
    const novoAviso = new Aviso({
      nome,
      descricao,
      turma: turmas.map(turma => turma._id),  // Apenas usaremos o _id das turmas
      autor,
    });

    // Salvar o aviso
    await novoAviso.save();

    // Retornar a resposta de sucesso
    return res.status(201).json({ message: "Aviso criado com sucesso!", aviso: novoAviso });
  } catch (error) {
    console.error("Erro ao criar aviso:", error);
    return res.status(500).json({ message: "Erro ao criar aviso", error: error.message });
  }
};

exports.updateAviso = async (req, res) => {
  try {
    const { id, nome, descricao, turma, disciplina } = req.body;

    if (!id || !nome || !descricao) {
      return res
        .status(400)
        .json({ message: "ID, nome e descrição devem ser fornecidos." });
    }

    const avisoAtualizado = await Aviso.findByIdAndUpdate(
      id,
      { nome, descricao, turma, disciplina },
      { new: true, runValidators: true }
    );

    if (!avisoAtualizado) {
      return res.status(404).json({ message: "Aviso não encontrado." });
    }

    return res
      .status(200)
      .json({
        message: "Aviso atualizado com sucesso!",
        aviso: avisoAtualizado,
      });
  } catch (error) {
    console.error("Erro ao atualizar aviso:", error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar aviso", error: error.message });
  }
};

exports.getAllAvisos = async (req, res) => {
  try {
    const autor = req.user.id;

    const avisos = await Aviso.find({ autor })
      .populate("turma")
      .populate("disciplina")
      .exec();

    if (avisos.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum aviso encontrado para este usuário." });
    }

    return res
      .status(200)
      .json({ message: "Avisos encontrados com sucesso!", avisos });
  } catch (err) {
    console.error("Erro ao buscar avisos:", err);
    return res.status(500).json({ message: "Erro ao buscar avisos", err });
  }
};

exports.getAvisoAluno = async (req, res) => {
  try {
    const { disciplina } = req.body; 
    const turma = req.user.turma; 
   
    const filtro = { turma }; 

    if (disciplina) {
      filtro.disciplina = disciplina; 
    }

    const avisos = await Aviso.find(filtro)
      .populate("turma", "nome") 
      .populate("disciplina", "nome") 
      .populate("autor", "nome email"); 

    res.status(200).json({ avisos });
  } catch (err) {
    console.error("Erro ao buscar avisos:", err);
    return res.status(500).json({ message: "Erro ao buscar avisos", err });
  }
};
