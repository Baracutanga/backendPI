const express = require("express");
const router = express.Router();
const disciplinaController = require("../controllers/disciplinaController");
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador")

router.post("/create", autenticaMiddlewareCoordenador, disciplinaController.createDisciplina);

router.get("/", autenticaMiddlewareCoordenador,  disciplinaController.getAllDisciplinas);

router.delete("/delete", autenticaMiddlewareCoordenador, disciplinaController.deleteDisciplina);

router.delete("/delete/all", autenticaMiddlewareCoordenador, disciplinaController.deleteAllDisciplinas);

module.exports = router;
