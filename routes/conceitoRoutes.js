const express = require("express");
const router = express.Router();
const conceitoController = require("../controllers/conceitoController");
const autenticaMiddlewareProfessor = require("../middleware/autenticaMiddlewareProfessor")
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador")

//getAll por turma e disciplina 
router.get("/turmadisciplina", autenticaMiddlewareProfessor, autenticaMiddlewareCoordenador, conceitoController.getConceitosPorTurmaEDisciplina)

// Adicionar/atualizar a nota de uma unidade
router.put("/unidade", autenticaMiddlewareProfessor, autenticaMiddlewareCoordenador, conceitoController.updateNotaUnidade);

router.put("/anual", autenticaMiddlewareProfessor, autenticaMiddlewareCoordenador, conceitoController.updateAnual);

module.exports = router;
