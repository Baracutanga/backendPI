const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');
const autenticaMiddlewareCoordenador = require("../middleware/autenticaMiddlewareCoordenador");
const autenticaMiddlewareAluno = require("../middleware/autenticaMiddlewareAluno");

router.post('/create', autenticaMiddlewareCoordenador, turmaController.createTurma);

router.get('/', autenticaMiddlewareCoordenador, turmaController.getAllTurmas);

router.get('/horario', autenticaMiddlewareAluno, turmaController.getHorarioAula);

router.put('/horario', autenticaMiddlewareAluno, turmaController.updateHorarioAula);

router.delete('/delete/:id?', autenticaMiddlewareCoordenador, turmaController.deleteTurma);

module.exports = router;
