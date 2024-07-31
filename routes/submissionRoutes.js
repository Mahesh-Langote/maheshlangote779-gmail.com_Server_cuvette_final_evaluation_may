const express = require('express');
const submissionController = require('../controllers/submissionController');
const auth = require('../middlewares/auth'); 
const uniqueIdController = require('../controllers/uniqueIdController');
const router = express.Router();

router.post('/', submissionController.submitForm);
router.get('/:formId', auth, submissionController.getSubmissions);
router.post('/submissions', submissionController.submitForm);
router.get('/submissions/:formId', submissionController.getSubmissions);
router.get('/generate-unique-id/:formId', uniqueIdController.generateUniqueId);
router.get('/form-submissions/:formId', submissionController.getSubmissions);

module.exports = router;