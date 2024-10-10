const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador")

router.post('/create', autenticaMiddlewareCoordenador, turmaController.createTurma);

router.get('/', autenticaMiddlewareCoordenador, turmaController.getAllTurmas);

router.delete('/delete/:id?', autenticaMiddlewareCoordenador, turmaController.deleteTurma);

module.exports = router;