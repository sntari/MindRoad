const express = require('express');
const router = express.Router();
const myPageController = require('../controllers/myPageController');

router.post('/info_r', myPageController.info_r);
router.post('/del_id', myPageController.del_id);
router.get('/logout', myPageController.logout);
router.post('/pie_info', myPageController.pie_info);
router.post('/Graph_BAD', myPageController.Graph_BAD);



module.exports = router;