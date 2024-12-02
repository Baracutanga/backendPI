const User = require('../models/userModel'); 
const Conceito = require('../models/conceitoModel');
const Turma = require('../models/turmaModel'); 
const mongoose = require("mongoose");

exports.createAluno = async (req, res) => {
  try {
    const { nome, email, senha, turma } = req.body;

    let turmaEncontrada = await Turma.findById(turma).populate('disciplinas');

    if (!turmaEncontrada) {
      turmaEncontrada = await Turma.findOne({ nome: turma }).populate('disciplinas');
    }

    if (!turmaEncontrada) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }

    const novoAluno = new User({
      nome,
      email,
      senha,
      user: "Aluno",
      turma: turmaEncontrada._id,
      conceitos: []
    });

    const conceitosPromises = turmaEncontrada.disciplinas.map(async (disciplina) => {
      const novoConceito = new Conceito({
        aluno: novoAluno._id,
        disciplina: disciplina._id,
        unidade1: { AV1: 0, AV2: 0, MU: 0, MUPN1: 0, MUPN2: 0 },
        unidade2: { AV1: 0, AV2: 0, MU: 0, MUPN1: 0, MUPN2: 0 },
        unidade3: { AV1: 0, AV2: 0, MU: 0, MUPN1: 0, MUPN2: 0 },
        MFA: 0,
        FT: 0,
        MFAPN: 0,
        resumo: ""
      });

      await novoConceito.save();
      return novoConceito._id;
    });

    const conceitosCriados = await Promise.all(conceitosPromises);
    novoAluno.conceitos = conceitosCriados;

    await novoAluno.save();

    turmaEncontrada.alunos.push(novoAluno._id);
    await turmaEncontrada.save();

    return res.status(201).json({ message: 'Aluno criado com sucesso!', aluno: novoAluno }); // Adiciona return aqui
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar aluno", error: error.message }); // Adiciona return aqui
  }
};

exports.getAllAlunos = async (req, res) => {
  try {
    const alunos = await User.find({ user: "Aluno" }).populate('turma'); 

    return res.status(200).json(alunos); // Adiciona return aqui

  } catch (error) {
    return res.status(500).json({ message: "Erro ao obter alunos", error: error.message }); // Adiciona return aqui
  }
};

exports.getConceitosPorTurmaEDisciplinaAlunoClient = async (req, res) => {
  try {
    const { turma, disciplina } = req.body;

    if (!turma || !disciplina) {
      return res.status(400).json({ message: "Turma e disciplina devem ser fornecidas." });
    }

    // Busca da turma
    const turmaEncontrada = (await Turma.findById(turma).populate("alunos")) || (await Turma.findOne({ nome: turma }).populate("alunos"));

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

exports.deleteAluno = async (req, res) => {
  try {
    const { aluno } = req.body;

    if (!aluno) {
      return res.status(400).json({ message: "ID do aluno não fornecido" });
    }

    let alunoEncontrado;
    if (mongoose.Types.ObjectId.isValid(aluno)) {
      alunoEncontrado = await User.findById(aluno);
    } else {
      return res.status(400).json({ message: "ID do aluno inválido" });
    }

    if (!alunoEncontrado) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    await Conceito.deleteMany({ aluno: alunoEncontrado._id });
    await User.findByIdAndDelete(alunoEncontrado._id);

    const turmaEncontrada = await Turma.findById(alunoEncontrado.turma);

    if (turmaEncontrada) {
      turmaEncontrada.alunos = turmaEncontrada.alunos.filter(a => !a.equals(alunoEncontrado._id));
      await turmaEncontrada.save();
    }

    return res.status(200).json({ message: 'Aluno deletado com sucesso!' }); // Adiciona return aqui
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar aluno", error: error.message }); // Adiciona return aqui
  }
};

exports.updateAluno = async (req, res) => {
  try {
    const { alunoId, nome, email } = req.body; // Campos a serem atualizados

    // Verifica se o ID do aluno é válido
    if (!mongoose.Types.ObjectId.isValid(alunoId)) {
      return res.status(400).json({ message: "ID do aluno inválido" });
    }

    // Encontra o aluno pelo ID
    const aluno = await User.findById(alunoId);
    
    if (!aluno || aluno.user !== "Aluno") {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    // Atualiza os campos fornecidos se eles existirem no corpo da requisição
    if (nome) {
      aluno.nome = nome; // Atualiza o nome se fornecido
    }
    if (email) {
      aluno.email = email; // Atualiza o email se fornecido
    }

    // Salva as alterações no banco de dados
    await aluno.save();

    return res.status(200).json({ message: "Aluno atualizado com sucesso!", aluno }); // Adiciona return aqui
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar aluno", error: error.message }); // Adiciona return aqui
  }
};
