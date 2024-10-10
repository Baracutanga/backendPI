const express = require("express");
const router = express.Router();
const avisoController = require("../controllers/avisoController"); 
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador")
const autenticaMiddlewareProfessor = require("../middleware/autenticaMiddlewareProfessor")

router.post("/create/professor", avisoController.createAviso);

router.post("/create/coordenador", avisoController.createAvisoCoordenador);

router.put("/:id",  autenticaMiddlewareCoordenador, avisoController.updateAviso);

router.get("/",  avisoController.getAllAvisos);

module.exports = router;
