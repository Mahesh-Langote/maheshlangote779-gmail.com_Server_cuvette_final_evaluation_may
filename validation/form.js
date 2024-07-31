const { body, param } = require('express-validator');

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

exports.getFormValidationRules = [
  param('id').isMongoId().withMessage('Invalid form ID'),
];

exports.deleteFormValidationRules = [
  param('id').isMongoId().withMessage('Invalid form ID'),
];