const Form = require('../models/Form');

exports.createForm = async (formData, userId) => {
  const form = new Form({ ...formData, creator: userId });
  return form.save();
};

exports.getForms = async (userId) => {
  return Form.find({ creator: userId });
};

exports.getFormById = async (formId) => {
  return Form.findById(formId);
};

exports.updateForm = async (formId, userId, updateData) => {
  return Form.findOneAndUpdate(
    { _id: formId, creator: userId },
    updateData,
    { new: true }
  );
};

exports.deleteForm = async (formId, userId) => {
  return Form.findOneAndDelete({ _id: formId, creator: userId });
};