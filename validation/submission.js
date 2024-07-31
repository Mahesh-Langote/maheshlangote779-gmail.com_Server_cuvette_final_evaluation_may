const { body, param } = require('express-validator');

exports.submissionValidationRules = [
  body('formId').notEmpty().withMessage('Form ID is required').isMongoId().withMessage('Invalid form ID'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('responses').isArray({ min: 1 }).withMessage('At least one response is required'),
  body('responses.*.field').notEmpty().withMessage('Field name is required'),
  body('responses.*.value').notEmpty().withMessage('Field value is required'),
];

exports.getSubmissionsValidationRules = [
  param('formId').isMongoId().withMessage('Invalid form ID'),
];