const User = require('../models/userModel');
const mongoose = require('mongoose');

exports.createCoordenador = async (req, res) => {
  try {
    const { email, nome, senha } = req.body;

    if (!email || !nome || !senha) {
      return res.status(400).json({ message: "Todos os campos devem ser fornecidos" });
    }

    const coordenador = new User({
      user: "Coordenador",
      email,
      nome,
      senha
    });

    await coordenador.save();
    return res.status(201).json({ message: 'Coordenador criado com sucesso!', coordenador });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao criar coordenador", error: err.message });
  }
};

exports.deleteCoordenador = async (req, res) => {
  try {
    const { coordenador } = req.body;

    if (!coordenador) {
      return res.status(400).json({ message: "ID ou nome do coordenador não fornecido" });
    }

    let coordenadorDeletado;

    if (mongoose.Types.ObjectId.isValid(coordenador)) {
      coordenadorDeletado = await User.findByIdAndDelete(coordenador);
    }

    if (!coordenadorDeletado) {
      coordenadorDeletado = await User.findOneAndDelete({ nome: coordenador, user: "Coordenador" });
    }

    if (!coordenadorDeletado) {
      return res.status(404).json({ message: "Coordenador não encontrado" });
    }

    res.status(200).json({ message: 'Coordenador deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar coordenador", error: error.message });
  }
};

exports.updateCoordenador = async (req, res) => {
  try {
    const { coordenadorId, nome, email } = req.body;

    // Verifica se o ID do coordenador foi fornecido
    if (!coordenadorId || (!nome && !email)) {
      return res.status(400).json({ message: "ID do coordenador e pelo menos um campo para atualizar devem ser fornecidos" });
    }

    // Verifica se o ID fornecido é válido
    if (!mongoose.Types.ObjectId.isValid(coordenadorId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Cria o objeto de atualização com os dados fornecidos
    const updates = {};
    if (nome) updates.nome = nome;
    if (email) updates.email = email;

    // Atualiza o coordenador com base no ID
    const coordenadorAtualizado = await User.findByIdAndUpdate(
      coordenadorId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!coordenadorAtualizado) {
      return res.status(404).json({ message: "Coordenador não encontrado" });
    }

    return res.status(200).json({ message: 'Coordenador atualizado com sucesso!', coordenador: coordenadorAtualizado });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao atualizar coordenador", error: err.message });
  }
};

exports.getAllCoordenadores = async (req, res) => {
  try{
    const coordenadores = await User.find({ user: "Coordenador" });

    return res.status(200).json(coordenadores);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
