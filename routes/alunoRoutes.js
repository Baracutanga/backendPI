const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController")
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador")
const autenticaMiddlewareProfessor = require("../middleware/autenticaMiddlewareProfessor")

router.post("/create", autenticaMiddlewareCoordenador, alunoController.createAluno);

//getAll por turma e disciplina feito Pelo Adm(Coordenador), // Rota específica para coordenador
router.get("/alunos",autenticaMiddlewareCoordenador, alunoController.getAllAlunos);

router.delete("/delete",autenticaMiddlewareCoordenador, alunoController.deleteAluno);

router.put("/update", autenticaMiddlewareCoordenador, alunoController.updateAluno);

module.exports = router;
