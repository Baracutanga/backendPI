const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController")
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador")
const autenticaMiddlewareProfessor = require("../middleware/autenticaMiddlewareProfessor")

router.post("/create", alunoController.createAluno);

router.get("/",  alunoController.getAllAlunos);

router.delete("/delete", alunoController.deleteAluno);

router.put("/update", alunoController.updateAluno);

module.exports = router;
