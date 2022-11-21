const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const usuarioController = require('../controllers/usuarios-controller')

router.post('/cadastro', usuarioController.usuarioCadastro)



router.post('/login', usuarioController.usuarioLogin)

module.exports = router;