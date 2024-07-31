const express = require('express');
const { body, validationResult } = require('express-validator');
const formController = require('../controllers/formController');
const auth = require('../middlewares/auth');

const shareFormController = require('../controllers/shareFormController');


const router = express.Router();

const validateForm = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('fields').isArray({ min: 1 }).withMessage('At least one field is required'),
  body('fields.*.label').notEmpty().withMessage('Field label is required'),
  body('fields.*.type').notEmpty().withMessage('Field type is required'),
  body('fields.*.errorMessage').optional().isString().withMessage('Error message must be a string'),
  body('background').notEmpty().withMessage('Background is required'),
  body('folder').notEmpty().withMessage('Folder ID is required'),
];

router.post('/', auth, validateForm, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, formController.createForm);

router.get('/', auth, formController.getForms);
router.get('/all', auth, formController.getAllFormsDetailed);  
router.get('/:id',auth, formController.getForm);
router.put('/:id', auth, formController.updateForm);
router.delete('/:id', auth, formController.deleteForm);
router.post('/:id/share', auth, shareFormController.shareForm);
router.get('/public/:shareableLink', shareFormController.getPublicForm);

router.get('/folder/:folderId', auth, formController.getFormsByFolder);

module.exports = router;