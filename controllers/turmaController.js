const Turma = require("../models/turmaModel");
const Disciplina = require("../models/disciplinaModel");
const User = require("../models/userModel");
const mongoose = require("mongoose")

exports.createTurma = async (req, res) => {
  try {
    const { nome, disciplinas, turno } = req.body;
    let disciplinasExistentes = [];

    if (disciplinas && Array.isArray(disciplinas)) {
      for (const disciplina of disciplinas) {
        let disciplinaExistente
      
        if (mongoose.isValidObjectId(disciplina)) {
          disciplinaExistente = await Disciplina.findById(disciplina);
        }
      
        if (!disciplinaExistente) {
          disciplinaExistente = await Disciplina.findOne({ nome: disciplina });
        }
      
        if (!disciplinaExistente) {
          return res.status(404).json({ message: `Disciplina não encontrada: ${disciplina}` });
        }
      
        disciplinasExistentes.push(disciplinaExistente);
      }
      
    } else {
      return res.status(400).json({ message: "Nenhuma disciplina foi fornecida ou o formato está incorreto." });
    }

    const novaTurma = new Turma({
      nome,
      disciplinas: disciplinasExistentes.map(disciplina => disciplina._id),
      turno
    });

    await novaTurma.save();

    await Disciplina.updateMany(
      { _id: { $in: disciplinasExistentes.map(d => d._id) } },
      { $addToSet: { turmas: novaTurma._id } }
    );

    const professoresAssociados = await User.find({
      _id: { $in: disciplinasExistentes.map(disciplina => disciplina.professor) }
    });

    await User.updateMany(
      { _id: { $in: professoresAssociados.map(professor => professor._id) } },
      { $addToSet: { turmas: novaTurma._id } }
    );

    return res.status(201).json({ message: "Turma criada com sucesso!", turma: novaTurma });
  } catch (err) {
    console.error("Erro ao criar turma:", err);
    return res.status(500).json({ message: "Erro ao criar turma", err });
  }
};

exports.getAllTurmas = async (req, res) => {
  try {
    const turmas = await Turma.find()
      .populate({
        path: "disciplinas",
        select: "-turmas",
        populate: { path: "professor", select: "nome" }
      })
      .populate({
        path: "alunos",
        select: "nome email"
      });

    return res.status(200).json(turmas);
  } catch (err) {
    console.error("Erro ao buscar turmas:", err);
    return res.status(500).json({ message: "Erro ao buscar turmas", err });
  }
};

exports.deleteTurma = async (req, res) => {
  try {
    const { turma } = req.params;
    let turmaEncontrada = await Turma.findById(turma).populate("disciplinas");

    if (!turmaEncontrada) {
      turmaEncontrada = await Turma.findOne({ nome: turma }).populate("disciplinas");
    }

    if (!turmaEncontrada) {
      return res.status(404).json({ message: "Turma não encontrada." });
    }

    await Disciplina.updateMany(
      { _id: { $in: turmaEncontrada.disciplinas } },
      { $pull: { turmas: turmaEncontrada._id } }
    );

    await User.findByIdAndUpdate(
      turmaEncontrada.professor,
      { $pull: { turmas: turmaEncontrada._id } }
    );

    await User.updateMany(
      { _id: { $in: turmaEncontrada.alunos } },
      { $pull: { turmas: turmaEncontrada._id } }
    );

    await Turma.findByIdAndDelete(turmaEncontrada._id);

    return res.status(200).json({ message: "Turma deletada com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar turma:", err);
    return res.status(500).json({ message: "Erro ao deletar turma", err });
  }
};
