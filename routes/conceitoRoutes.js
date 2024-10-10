const express = require("express");
const router = express.Router();
const conceitoController = require("../controllers/conceitoController");
const autenticaMiddlewareProfessor = require("../middleware/autenticaMiddlewareProfessor")
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador")

router.get("/turmadisciplina", conceitoController.getConceitosPorTurmaEDisciplina)

router.put("/unidade", conceitoController.updateNotaUnidade);

router.put("/anual", conceitoController.updateAnual);

module.exports = router;
