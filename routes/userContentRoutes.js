const express = require('express');
const userContentController = require('../controllers/userContentController');
const auth = require('../middlewares/auth');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/content', auth, userContentController.getUserContent);

router.get('/user-info', auth, userController.getUserInfo);

module.exports = router; 

