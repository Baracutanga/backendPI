const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv") .config();

module.exports = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Sem token, autorização negada" });
  }
  
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Sem token, autorização negada" });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = await User.findById(decoded.id);
    
    if (!req.user || req.user.user !== "Coordenador") {
      return res.status(401).json({ message: "Usuário não encontrado ou não autorizado" });
    }

    next(); 
  } catch (error) {
    res.status(401).json({ message: "Token não válido" });
  }
};
