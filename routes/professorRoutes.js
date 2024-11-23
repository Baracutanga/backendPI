const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador")
const autenticaMiddlewareProfCoord = require('../middleware/autenticaMiddlewarepProfCoord')

router.get("/", autenticaMiddlewareCoordenador, professorController.getAllProfessores);

router.post("/create", autenticaMiddlewareCoordenador, professorController.createProfessor);

router.delete("/delete", autenticaMiddlewareCoordenador, professorController.deleteProfessor);

router.put("/update", autenticaMiddlewareCoordenador, professorController.updateProfessor);

module.exports = router;
