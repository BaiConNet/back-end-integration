const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/user.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/search', getUser);

module.exports = router;
