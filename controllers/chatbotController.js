const Form = require('../models/Form');
const Submission = require('../models/Submission');
const { v4: uuidv4 } = require('uuid');

exports.renderChatbot = async (req, res) => {
  const { formId } = req.params;
  res.render('chatbot', { formId });
};

exports.getFormData = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.generateUniqueId = async (req, res) => {
  const uniqueId = uuidv4();
  res.json({ uniqueId });
};
exports.submitResponse = async (req, res) => {
    try {
      const { formId, uniqueId, responses } = req.body;
      
      console.log('Received submission:', { formId, uniqueId, responses });
  
      let submission = await Submission.findOne({ uniqueId });
      
      if (submission) { 
        // Update existing submission
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
        // Create new submission
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