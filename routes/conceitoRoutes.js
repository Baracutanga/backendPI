const express = require("express");
const router = express.Router();
const conceitoController = require("../controllers/conceitoController");
const autenticaMiddlewareAluno = require("../middleware/autenticaMiddlewareAluno");
const autenticaMiddlewareProfessor = require("../middleware/autenticaMiddlewareProfessor");
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador");

//getAll por turma e disciplina 
router.get("/turmadisciplina", autenticaMiddlewareProfessor, autenticaMiddlewareCoordenador, conceitoController.getConceitosPorTurmaEDisciplina);

//getAll por turma e disciplina para a tela do aluno(Client), // Rota específica para alunos
router.get("/alunos/turmadisciplina", autenticaMiddlewareAluno,conceitoController.getConceitosPorTurmaEDisciplinaAlunoClient);

// Adicionar/atualizar a nota de uma unidade
router.put("/unidade", autenticaMiddlewareProfessor, autenticaMiddlewareCoordenador, conceitoController.updateNotaUnidade);

router.put("/anual", autenticaMiddlewareProfessor, autenticaMiddlewareCoordenador, conceitoController.updateAnual);

module.exports = router;
