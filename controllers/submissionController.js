const Submission = require('../models/Submission');

exports.submitForm = async (req, res) => {
  try {
    const { formId, uniqueId, responses } = req.body;
    
    let submission = await Submission.findOne({ uniqueId });
    
    if (submission) { 
      const updatedResponses = [...submission.responses];
      responses.forEach(newResponse => {
        const existingIndex = updatedResponses.findIndex(r => r.field === newResponse.field);
        if (existingIndex !== -1) {
          updatedResponses[existingIndex] = newResponse;
        } else {
          updatedResponses.push(newResponse);
        }
      });
      submission.responses = updatedResponses;
    } else { 
      submission = new Submission({
        form: formId,
        uniqueId,
        responses,
      });
    }
    
    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ form: req.params.formId });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ form: req.params.formId });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};