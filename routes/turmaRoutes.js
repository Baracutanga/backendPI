const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador")

router.post('/create',  turmaController.createTurma);

router.get('/', turmaController.getAllTurmas);

router.delete('/delete/:id?', turmaController.deleteTurma);

module.exports = router;
