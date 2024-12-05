const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const authenticateAluno = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.user !== "Aluno") {
      return res.status(403).json({ error: "Acesso negado. Contate a coordenação." });
    }

    req.user = {
      id: user._id,
      user: user.user, 
      email: user.email,
      nome: user.nome,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

module.exports = authenticateAluno;
