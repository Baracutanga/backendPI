const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv") .config();

module.exports = async (req, res, next) => {
  // Pegando o token do header
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Sem token, autorização negada" });
  }

  // Extraindo o token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Sem token, autorização negada" });
  }

  try {
    // Verificando o token com a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Certifique-se de que config.secret é o valor correto do JWT_SECRET
    req.user = await User.findById(decoded.id);
    
    if (!req.user || req.user.user !== "Professor") {
      return res.status(401).json({ message: "Usuário não encontrado ou não autorizado" });
    }

    next(); // Passa para o próximo middleware/rota
  } catch (error) {
    res.status(401).json({ message: "Token não válido" });
  }
};
