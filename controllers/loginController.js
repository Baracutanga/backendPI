const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config(); s

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o email e a senha foram fornecidos
    if (!email || !senha) {
      return res.status(401).json({ status: "fail", message: "Login e senha requeridos!" });
    }

    // Buscar usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: "fail", message: "Usuário não encontrado!" });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await user.compareSenha(senha); // Chame o método corretamente
    if (!isPasswordValid) {
      return res.status(401).json({ status: "fail", message: "Senha inválida!" });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: user._id, role: user.user, isAdmin: user.isAdmin }, // Payload do token
      process.env.JWT_SECRET, // Chave secreta do JWT armazenada no .env
      { expiresIn: '1h' } // O token expira em 1 hora
    );

    // Retornar o token no response
    res.status(200).json({
      status: "success",
      message: "Login bem-sucedido",
      token,
      user: { id: user._id, nome: user.nome, email: user.email, role: user.user } // Informações do usuário
    });

  } catch (err) {
    res.status(400).json({
      message: "Erro ao realizar o login",
      error: err.message
    });
  }
};
