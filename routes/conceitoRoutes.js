const express = require("express");
const router = express.Router();
const conceitoController = require("../controllers/conceitoController");
const autenticaMiddlewareAluno = require("../middleware/autenticaMiddlewareAluno");
const autenticaMiddlewareProfessor = require("../middleware/autenticaMiddlewareProfessor");
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador");
const autenticaMiddlewareProfCoord = require("../middleware/autenticaMiddlewareProfCoord");

//getAll por turma e disciplina 
router.get("/turmadisciplina", autenticaMiddlewareProfCoord, conceitoController.getConceitosPorTurmaEDisciplina);

//getAll 
router.get("/", autenticaMiddlewareProfCoord, conceitoController.getConceitosAluno);

//getAll por turma e disciplina para a tela do aluno(Client), // Rota específica para alunos
router.get("/aluno", autenticaMiddlewareAluno, conceitoController.getConceitosAluno);

// Adicionar/atualizar a nota de uma unidade
router.put("/unidade", autenticaMiddlewareProfessor, conceitoController.updateNotaUnidade);

// Adicionar/atualizar a nota do ano
router.put("/anual", autenticaMiddlewareProfessor, conceitoController.updateAnual);

module.exports = router;
