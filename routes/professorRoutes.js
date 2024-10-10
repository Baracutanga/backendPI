const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador")

router.get("/", professorController.getAllProfessores);

router.post("/create", professorController.createProfessor);

router.delete("/delete", professorController.deleteProfessor);

router.put("/update", professorController.updateProfessor);

module.exports = router;
