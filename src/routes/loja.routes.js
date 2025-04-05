const express = require('express');
const router = express.Router();
const lojaController = require('../controllers/loja.controller');

router.post('/register', lojaController.register);
router.post('/login', lojaController.login);

module.exports = router;
