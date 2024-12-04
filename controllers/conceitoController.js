const Conceito = require('../models/conceitoModel');
const Turma = require('../models/turmaModel');
const Disciplina = require('../models/disciplinaModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

exports.updateNotaUnidade = async (req, res) => {
  try {
    const { aluno, disciplina, unidade, notas } = req.body;

    if (!aluno || !disciplina  || !unidade || !notas) {
      return res.status(400).json({ message: "ID do aluno, disciplina, unidade ou notas não fornecidos" });
    }
    let alunoExistente;

    if (mongoose.isValidObjectId(aluno)) {
      alunoExistente = await User.findById(aluno);
    }

    if (!alunoExistente) {
      alunoExistente = await User.findOne({ nome: aluno });
    }

    if (!alunoExistente) {
      return res.status(404).json({ message: `Aluno não encontrado: ${aluno}` });
    }

    let disciplinaExistente;

    if (mongoose.isValidObjectId(disciplina)) {
      disciplinaExistente = await Disciplina.findById(disciplina);
    }

    if (!disciplinaExistente) {
      disciplinaExistente = await Disciplina.findOne({ nome: disciplina });
    }

    if (!disciplinaExistente) {
      return res.status(404).json({ message: `Disciplina não encontrada: ${disciplina}` });
    }

    
    const conceito = await Conceito.findOne({ aluno: alunoId, disciplina: disciplinaExistente });

    if (!conceito) {
      return res.status(404).json({ message: "Conceito não encontrado" });
    }

    if (['unidade1', 'unidade2', 'unidade3'].includes(unidade)) {
      conceito[unidade] = { ...conceito[unidade], ...notas };
    } else {
      return res.status(400).json({ message: "Unidade inválida. Use 'unidade1', 'unidade2' ou 'unidade3'." });
    }

    await conceito.save();

    return res.status(200).json({ message: 'Notas atualizadas com sucesso!', conceito });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar conceito", error: error.message });
  }
};

exports.updateAnual = async (req, res) => {
  try {
    const { alunoId, disciplinaId, tipoNota, valor } = req.body;

    if (!alunoId || !disciplinaId || !tipoNota || valor === undefined) {
      return res.status(400).json({ message: "ID do aluno, disciplina, tipo de nota ou valor não fornecidos" });
    }

    const conceito = await Conceito.findOne({ aluno: alunoId, disciplina: disciplinaId });

    if (!conceito) {
      return res.status(404).json({ message: "Conceito não encontrado" });
    }

    if (['MFA', 'FT', 'MFAPN', 'resumo'].includes(tipoNota)) {
      conceito[tipoNota] = valor;
    } else {
      return res.status(400).json({ message: "Tipo de nota inválido. Use 'MFA', 'FT', 'MFAPN' ou 'resumo'." });
    }

    await conceito.save();

    return res.status(200).json({ message: 'Nota atualizada com sucesso!', conceito });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar conceito", error: error.message });
  }
};

exports.getConceitosPorTurmaEDisciplina = async (req, res) => {
  try {
    const { turma, disciplina } = req.body;

    if (!turma || !disciplina) {
      return res.status(400).json({ message: "ID ou nome da turma e disciplina não fornecidos" });
    }

    let turmaEncontrada = await Turma.findById(turma).populate('alunos');

    if (!turmaEncontrada) {
      turmaEncontrada = await Turma.findOne({ nome: turma }).populate('alunos');
    }

    if (!turmaEncontrada) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }

    const alunosIds = turmaEncontrada.alunos.map(aluno => aluno._id);

    let disciplinaEncontrada = await Disciplina.findById(disciplina);

    if (!disciplinaEncontrada) {
      disciplinaEncontrada = await Disciplina.findOne({ nome: disciplina });
    }

    if (!disciplinaEncontrada) {
      return res.status(404).json({ message: "Disciplina não encontrada" });
    }

    const conceitos = await Conceito.find({
      aluno: { $in: alunosIds },
      disciplina: disciplinaEncontrada._id
    });

    if (!conceitos.length) {
      return res.status(404).json({ message: "Nenhum conceito encontrado para a turma e disciplina especificadas" });
    }

    return res.status(200).json(conceitos);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar conceitos", error: error.message });
  }
};

exports.getConceitosPorTurmaEDisciplinaAlunoClient = async (req, res) => {
  try {
    const { disciplina } = req.body;
    //Filtro para o usuário(aluno) ser buscado pela turma que está presente no seu modelo
    const turma = req.user.turma;

    if (!turma || !disciplina) {
      return res.status(400).json({ message: "Turma e disciplina devem ser fornecidas." });
    }

    // Busca da turma
    const turmaEncontrada = (await Turma.findById(turma)) || (await Turma.findOne({ nome: turma }));

    if (!turmaEncontrada) {
      return res.status(404).json({ message: "Turma não encontrada." });
    }

    // Busca da disciplina
    const disciplinaEncontrada = (await Disciplina.findById(disciplina)) || (await Disciplina.findOne({ nome: disciplina }));

    // Se a Disciplina não for encontrada
    if (!disciplinaEncontrada) {
      return res.status(404).json({ message: "Disciplina não encontrada." });
    }

    // Verifica se req.user está disponível
    if (!req.user || !req.user._id) {
      return res.status(403).json({ message: "Aluno não autorizado. Faça login novamente." });
    }

    // Busca os conceitos do aluno logado
    const conceitos = await Conceito.find({aluno: req.user._id, // Aluno logado
    disciplina: disciplinaEncontrada._id, // Disciplina fornecida
    });

    if (!conceitos.length) {
      return res.status(404).json({ message: "Nenhum conceito encontrado para a disciplina especificada." });
    }

    return res.status(200).json(conceitos);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar conceitos", error: error.message });
  }
};
