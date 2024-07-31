const Submission = require('../models/Submission');

exports.submitForm = async (submissionData) => {
  const submission = new Submission(submissionData);
  return submission.save();
};

exports.getSubmissions = async (formId) => {
  return Submission.find({ form: formId }).populate('form', 'title');
};