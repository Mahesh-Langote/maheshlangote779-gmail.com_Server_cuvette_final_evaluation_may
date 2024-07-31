const mongoose = require('mongoose');
const Form = require('../models/Form');
const Folder = require('../models/Folder');
const { validationResult } = require('express-validator');
 
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const validateFields = (fields) => {
  if (!Array.isArray(fields) || fields.length === 0) {
    return 'At least one form field is required';
  }
  for (let field of fields) {
    if (!field.label || typeof field.label !== 'string' || field.label.trim() === '') {
      return 'Each field must have a non-empty label';
    }
    if (!field.type || typeof field.type !== 'string') {
      return 'Each field must have a valid type';
    }
  }
  return null;
};

exports.createForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, fields, background, folder } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Form title is required and must be a non-empty string' });
    }

    const fieldsValidationError = validateFields(fields);
    if (fieldsValidationError) {
      return res.status(400).json({ message: fieldsValidationError });
    }

    if (folder && !isValidObjectId(folder)) {
      return res.status(400).json({ message: 'Invalid folder ID format' });
    }

    if (folder) {
      const folderExists = await Folder.findOne({ _id: folder, creator: req.user.id });
      if (!folderExists) {
        return res.status(400).json({ message: 'Invalid folder ID or folder does not belong to the user' });
      }
    }

    if (background && typeof background !== 'string') {
      return res.status(400).json({ message: 'Background must be a string' });
    }

    const fieldsWithErrors = fields.map(field => ({
      ...field,
      errorMessage: field.errorMessage || `Please enter a valid ${field.label.toLowerCase()}`
    }));

    const form = new Form({
      title,
      description: description || '',
      fields: fieldsWithErrors,
      background: background || 'Light',
      creator: req.user.id,
      folder,
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ message: 'Server error while creating form', error: error.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find({ creator: req.user.id });
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Server error while fetching forms', error: error.message });
  }
};

exports.getForm = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!req.params.id) {
      return res.status(400).json({ message: 'Form ID is required' });
    }

    if (req.params.id === 'new') {
      return res.json({
        title: '',
        description: '',
        fields: [],
        background: 'Light',
        creator: req.user.id,
      });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid form ID format' });
    }

    const form = await Form.findOne({ _id: req.params.id, creator: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or you do not have permission to access it' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ message: 'Server error while fetching form', error: error.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid form ID format' });
    }

    const { title, description, fields, background, folder } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Form title is required and must be a non-empty string' });
    }

    const fieldsValidationError = validateFields(fields);
    if (fieldsValidationError) {
      return res.status(400).json({ message: fieldsValidationError });
    }

    if (folder && !isValidObjectId(folder)) {
      return res.status(400).json({ message: 'Invalid folder ID format' });
    }

    if (folder) {
      const folderExists = await Folder.findOne({ _id: folder, creator: req.user.id });
      if (!folderExists) {
        return res.status(400).json({ message: 'Invalid folder ID or folder does not belong to the user' });
      }
    }

    if (background && typeof background !== 'string') {
      return res.status(400).json({ message: 'Background must be a string' });
    }

    const fieldsWithErrors = fields.map(field => ({
      ...field,
      errorMessage: field.errorMessage || `Please enter a valid ${field.label.toLowerCase()}`
    }));

    const updatedForm = await Form.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
      { title, description: description || '', fields: fieldsWithErrors, background: background || 'Light', folder },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: 'Form not found or you do not have permission to update it' });
    }

    res.json(updatedForm);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ message: 'Server error while updating form', error: error.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid form ID format' });
    }

    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    if (form.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this form' });
    }
    
    const deletedForm = await Form.findOneAndDelete({ _id: req.params.id, creator: req.user.id });
    if (!deletedForm) {
      return res.status(500).json({ message: 'Failed to delete the form' });
    }
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Server error while deleting form', error: error.message });
  }
};

exports.getAllFormsDetailed = async (req, res) => {
  try {
    const forms = await Form.find({ creator: req.user.id })
      .populate('folder', 'name')
      .sort({ createdAt: -1 });

    const detailedForms = forms.map(form => ({
      id: form._id,
      title: form.title,
      description: form.description,
      fields: form.fields,
      background: form.background,
      folder: form.folder ? { id: form.folder._id, name: form.folder.name } : null,
      createdAt: form.createdAt
    }));

    res.json(detailedForms);
  } catch (error) {
    console.error('Error fetching all forms:', error);
    res.status(500).json({ message: 'Server error while fetching all forms', error: error.message });
  }
};

exports.getFormsByFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;

    if (!isValidObjectId(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID format' });
    }

    const folder = await Folder.findOne({ _id: folderId, creator: req.user.id });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found or you do not have permission to access it' });
    }

    const forms = await Form.find({ folder: folderId, creator: req.user.id })
      .sort({ createdAt: -1 });

    const detailedForms = forms.map(form => ({
      id: form._id,
      title: form.title,
      description: form.description,
      fields: form.fields,
      background: form.background,
      createdAt: form.createdAt
    }));

    res.json(detailedForms);
  } catch (error) {
    console.error('Error fetching forms by folder:', error);
    res.status(500).json({ message: 'Server error while fetching forms', error: error.message });
  }
};