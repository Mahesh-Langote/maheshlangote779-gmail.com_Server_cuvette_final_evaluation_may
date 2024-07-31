const { body, param } = require('express-validator');

exports.folderValidationRules = [
  body('name').notEmpty().withMessage('Folder name is required'),
];

exports.updateFolderValidationRules = [
  param('id').isMongoId().withMessage('Invalid folder ID'),
  body('name').notEmpty().withMessage('Folder name is required'),
];

exports.deleteFolderValidationRules = [
  param('id').isMongoId().withMessage('Invalid folder ID'),
];