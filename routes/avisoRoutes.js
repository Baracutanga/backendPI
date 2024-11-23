const express = require("express");
const router = express.Router();
const avisoController = require("../controllers/avisoController"); 
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador");
const autenticaMiddlewareProfessor = require("../middleware/autenticaMiddlewareProfessor");
const autenticaMiddlewareProfCoord = require('../middleware/autenticaMiddlewarepProfCoord');

// Criar aviso de Professor
router.post("/create/professor", autenticaMiddlewareProfCoord, avisoController.createAviso);

// Criar aviso de Coordenador (para todas as turmas)
router.post("/create/coordenador", avisoController.createAvisoCoordenador);

// Atualizar aviso
router.put("/:id", autenticaMiddlewareProfessor, autenticaMiddlewareCoordenador, avisoController.updateAviso);

// Obter todos os avisos do usuario logado
router.get("/", autenticaMiddlewareProfessor, autenticaMiddlewareCoordenador, avisoController.getAllAvisos);

module.exports = router;
