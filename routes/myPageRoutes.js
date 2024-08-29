const express = require('express');
const router = express.Router();
const myPageController = require('../controllers/myPageController');

router.post('/info_r', myPageController.info_r);


module.exports = router;