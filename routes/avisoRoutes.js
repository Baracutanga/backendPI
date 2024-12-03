const express = require("express");
const router = express.Router();
const avisoController = require("../controllers/avisoController"); 
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador");
const autenticaMiddlewareProfessor = require("../middleware/autenticaMiddlewareProfessor");
const autenticaMiddlewareProfCoord = require('../middleware/autenticaMiddlewareProfCoord');

// Criar aviso de Professor
router.post("/create/professor", autenticaMiddlewareProfessor, avisoController.createAviso);

// Criar aviso de Coordenador (para todas as turmas)
router.post("/create/coordenador",autenticaMiddlewareCoordenador, avisoController.createAvisoCoordenador);

// Atualizar aviso
router.put("/:id", autenticaMiddlewareProfCoord, avisoController.updateAviso);

// Obter todos os avisos do usuario logado
router.get("/", autenticaMiddlewareProfCoord, avisoController.getAllAvisos);

// Obter os avisos do aluno
router.get("/aluno", avisoController.getAvisoAluno);

module.exports = router;
