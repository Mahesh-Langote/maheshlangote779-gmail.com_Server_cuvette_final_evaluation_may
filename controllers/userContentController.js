const Form = require('../models/Form');
const Folder = require('../models/Folder');

exports.getUserContent = async (req, res) => {
  try {
    const userId = req.user.userId;

    const folders = await Folder.find({ creator: userId });
    const forms = await Form.find({ creator: userId }).populate('folder', 'name');

    const content = {
      folders: folders.map(folder => ({
        id: folder._id,
        name: folder.name,
        createdAt: folder.createdAt
      })),
      forms: forms.map(form => ({
        id: form._id,
        title: form.title,
        description: form.description,
        fields: form.fields,
        background: form.background,
        folder: form.folder ? { id: form.folder._id, name: form.folder.name } : null,
        createdAt: form.createdAt
      }))
    };

    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};