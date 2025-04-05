const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const painelController = require('../controllers/painel.controller');

router.get('/', auth, painelController.getPainel);

module.exports = router;
