const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const authenticateCoordenador = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.user !== "Coordenador") {
      return res.status(403).json({ message: "Acesso negado. Apenas Coordenadores podem acessar." });
    }

    req.user = {
      user: user.user, 
      email: user.email,
      nome: user.nome,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

module.exports = authenticateCoordenador;
