const shortid = require('shortid');
const Submission = require('../models/Submission');

exports.generateUniqueId = async (req, res) => {
  try {
    const { formId } = req.params;
    let uniqueId;
    let existingSubmission;

    do {
      uniqueId = shortid.generate().slice(0, 8);
      existingSubmission = await Submission.findOne({ uniqueId });
    } while (existingSubmission);

    const newSubmission = new Submission({
      form: formId,
      uniqueId,
      responses: [],
    });
    await newSubmission.save();

    res.status(200).json({ uniqueId });
  } catch (error) {
    console.error('Error generating unique ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};