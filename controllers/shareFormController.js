const Form = require('../models/Form');

exports.shareForm = async (req, res) => {
  try {
    const formId = req.params.id;
    const form = await Form.findOne({ _id: formId, creator: req.user.id });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    if (!form.isPublic) {
      form.isPublic = true;
      form.shareableLink = formId; // Use formId as the shareable link
      await form.save();
    }
    const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';

    res.json({ shareableLink: `${clientURL}/api/forms/public/${form.shareableLink}` });
  } catch (error) {
    console.error('Error sharing form:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPublicForm = async (req, res) => {
  try {
    const shareableLink = req.params.shareableLink;
    const form = await Form.findOne({ _id: shareableLink, isPublic: true });

    if (!form) {
      return res.status(404).json({ message: 'Form not found or not public' });
    }
    const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
    res.json({
      id: form.id,  
      title: form.title,
      description: form.description,
      fields: form.fields,
      background: form.background,
      shareableLink: `${clientURL}/api/forms/public/${form.shareableLink}`
    });
  } catch (error) {
    console.error('Error getting public form:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};