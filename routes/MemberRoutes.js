const express = require('express');
const router = express.Router();
const memberController = require('../controllers/MemberController');

router.post('/register', memberController.register);
router.post('/login', memberController.login);
router.get('/logout', memberController.logout);


module.exports = router;