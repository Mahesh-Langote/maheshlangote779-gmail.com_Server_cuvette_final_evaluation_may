const express = require('express');
const folderController = require('../controllers/folderController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, folderController.createFolder);
router.get('/', auth, folderController.getFolders);
router.get('/all', auth, folderController.getAllFoldersDetailed);  
router.delete('/:id', auth, folderController.deleteFolder);

module.exports = router;