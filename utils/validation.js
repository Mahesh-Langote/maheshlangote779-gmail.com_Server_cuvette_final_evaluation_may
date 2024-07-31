const { body, param, validationResult } = require('express-validator');

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.registerValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.loginValidationRules = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.formValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('fields').isArray({ min: 1 }).withMessage('At least one field is required'),
  body('fields.*.label').notEmpty().withMessage('Field label is required'),
  body('fields.*.type').notEmpty().withMessage('Field type is required'),
  body('fields.*.required').isBoolean().withMessage('Field required must be a boolean'),
  body('fields.*.options').optional().isArray().withMessage('Field options must be an array'),
  body('fields.*.errorMessage').optional().isString().withMessage('Error message must be a string'),
  body('background').notEmpty().withMessage('Background is required'),
  body('folder').notEmpty().withMessage('Folder ID is required').isMongoId().withMessage('Invalid folder ID'),
];

exports.updateFormValidationRules = [
  param('id').isMongoId().withMessage('Invalid form ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('fields').optional().isArray({ min: 1 }).withMessage('At least one field is required'),
  body('fields.*.label').optional().notEmpty().withMessage('Field label cannot be empty'),
  body('fields.*.type').optional().notEmpty().withMessage('Field type cannot be empty'),
  body('fields.*.required').optional().isBoolean().withMessage('Field required must be a boolean'),
  body('fields.*.options').optional().isArray().withMessage('Field options must be an array'),
  body('fields.*.errorMessage').optional().isString().withMessage('Error message must be a string'),
  body('background').optional().notEmpty().withMessage('Background cannot be empty'),
  body('folder').optional().isMongoId().withMessage('Invalid folder ID'),
];

exports.folderValidationRules = [
  body('name').notEmpty().withMessage('Folder name is required'),
];

exports.updateFolderValidationRules = [
  param('id').isMongoId().withMessage('Invalid folder ID'),
  body('name').notEmpty().withMessage('Folder name is required'),
];

exports.submissionValidationRules = [
  body('formId').notEmpty().withMessage('Form ID is required').isMongoId().withMessage('Invalid form ID'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('responses').isArray({ min: 1 }).withMessage('At least one response is required'),
  body('responses.*.field').notEmpty().withMessage('Field name is required'),
  body('responses.*.value').notEmpty().withMessage('Field value is required'),
];

exports.getFormValidationRules = [
  param('id').isMongoId().withMessage('Invalid form ID'),
];

exports.deleteFolderValidationRules = [
  param('id').isMongoId().withMessage('Invalid folder ID'),
];

exports.deleteFormValidationRules = [
  param('id').isMongoId().withMessage('Invalid form ID'),
];

exports.getSubmissionsValidationRules = [
  param('formId').isMongoId().withMessage('Invalid form ID'),
];

exports.getUserContentValidationRules = [
  // No specific rules needed for this endpoint, but we can add if necessary
];