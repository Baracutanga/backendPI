const mongoose = require("mongoose");
const User = require('../models/userModel');
const Disciplina = require('../models/disciplinaModel');

exports.createDisciplina = async (req, res) => {
  try {
    const { nome, professor } = req.body;

    let professorQuery;

    if (mongoose.Types.ObjectId.isValid(professor)) {
      professorQuery = await User.findById(professor);
    } else {
      professorQuery = await User.findOne({ nome: professor, user: 'Professor' });
    }

    if (!professorQuery || professorQuery.user !== 'Professor') {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    const novaDisciplina = new Disciplina({
      nome,
      professor: professorQuery._id 
    });

    await novaDisciplina.save();

    professorQuery.disciplinas.push(novaDisciplina._id);
    await professorQuery.save();

    return res.status(201).json({ message: 'Disciplina criada e professor atualizado com sucesso!', disciplina: novaDisciplina });
  } catch (error) {
    console.error('Erro ao criar disciplina:', error);
    return res.status(500).json({ message: 'Erro ao criar disciplina', error: error.message || 'Erro desconhecido' });
  }
};

exports.getAllDisciplinas = async (req, res) => {
  try {
    const disciplinas = await Disciplina.find().populate('professor', 'nome');
    return res.status(200).json(disciplinas);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    return res.status(500).json({ message: 'Erro ao buscar disciplinas', error: error.message || 'Erro desconhecido' });
  }
};

exports.deleteDisciplina = async (req, res) => {
  try {
    const { disciplina } = req.body;

    let disciplinaQuery;

    if (mongoose.Types.ObjectId.isValid(disciplina)) {
      disciplinaQuery = await Disciplina.findById(disciplina);
    } else {
      disciplinaQuery = await Disciplina.findOne({ nome: disciplina });
    }

    if (!disciplinaQuery) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    await Disciplina.findByIdAndDelete(disciplinaQuery._id);

    const professorQuery = await User.findById(disciplinaQuery.professor);

    if (professorQuery) {
      professorQuery.disciplinas = professorQuery.disciplinas.filter(d => {
        return d.DisciplinaId && !d.DisciplinaId.equals(disciplinaQuery._id);
      });
      await professorQuery.save();
    }

    const turmas = disciplinaQuery.turmas;
    if (turmas.length > 0) {
      await Turma.updateMany(
        { _id: { $in: turmas } },
        { $pull: { disciplinas: disciplinaQuery._id } }
      );
    }

    return res.status(200).json({ message: 'Disciplina deletada e professor/turmas atualizados com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar disciplina:', error);
    return res.status(500).json({ message: 'Erro ao deletar disciplina', error: error.message || 'Erro desconhecido' });
  }
};

exports.deleteAllDisciplinas = async (req, res) => {
  try {
    const result = await Disciplina.deleteMany({});
    return res.status(200).json({ message: 'Todas as disciplinas foram deletadas com sucesso!', result });
  } catch (error) {
    console.error('Erro ao deletar disciplinas:', error);
    return res.status(500).json({ message: 'Erro ao deletar disciplinas', error: error.message || 'Erro desconhecido' });
  }
};
