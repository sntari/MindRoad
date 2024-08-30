const express = require('express');
const router = express.Router();
const myPageController = require('../controllers/myPageController');

router.post('/info_r', myPageController.info_r);
router.post('/del_id', myPageController.del_id);
router.get('/logout', myPageController.logout);



module.exports = router;