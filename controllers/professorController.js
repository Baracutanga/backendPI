const User = require("../models/userModel");

exports.createProfessor = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const novoProfessor = new User({
      user: "Professor",
      nome,
      email,
      senha,
    });

    await novoProfessor.save();

    return res.status(201).json({
      status: "Success",
      message: "Professor criado com sucesso!",
      professor: novoProfessor,
    });
  } catch (error) {
    console.error("Erro ao criar professor:", error);
    return res.status(500).json({ message: "Erro ao criar professor", error });
  }
};

exports.getAllProfessores = async (req, res) => {
  try {
    const professores = await User.find({ user: "Professor" });
    return res.status(200).json(professores);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteProfessor = async (req, res) => {
  const { id } = req.body;

  try {
    const professorDeletado = await User.findByIdAndDelete(id);

    if (!professorDeletado) {
      return res.status(404).json({
        status: "fail",
        message: "Professor não encontrado.",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Professor deletado com sucesso",
      data: professorDeletado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Erro desconhecido",
    });
  }
};

exports.updateProfessor = async (req, res) => {
  try {
    const { id, nome, email } = req.body;

    if (!id || (!nome && !email)) {
      return res.status(400).json({ message: "ID e pelo menos um campo a ser atualizado são necessários." });
    }

    const professorAtualizado = await User.findByIdAndUpdate(
      id,
      { nome, email },
      { new: true, runValidators: true } // Retorna o documento atualizado e valida os dados
    );

    if (!professorAtualizado) {
      return res.status(404).json({ message: "Professor não encontrado." });
    }

    return res.status(200).json({
      status: "Success",
      message: "Professor atualizado com sucesso!",
      professor: professorAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar professor:", error);
    return res.status(500).json({ message: "Erro ao atualizar professor", error });
  }
};
