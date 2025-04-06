const express = require('express');
const router = express.Router();
const { getResumoDashboard  } = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');
const verificarPermissao = require('../middleware/role.middleware');

router.get('/', authMiddleware, verificarPermissao('dono'), getResumoDashboard );

module.exports = router;
