const Folder = require('../models/Folder');
const { validationResult } = require('express-validator');

exports.createFolder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Folder name is required' });
    }
 
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User authentication failed' });
    }
 
    const existingFolder = await Folder.findOne({ 
      name: name.trim(), 
      creator: req.user.id 
    });

    if (existingFolder) {
      return res.status(400).json({ message: 'A folder with this name already exists' });
    }

    const folder = new Folder({ name: name.trim(), creator: req.user.id });
    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ message: 'Server error while creating folder', error: error.message });
  }
};

exports.getFolders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User authentication failed' });
    }

    const folders = await Folder.find({ creator: req.user.id });
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ message: 'Server error while fetching folders', error: error.message });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User authentication failed' });
    }

    if (!req.params.id) {
      return res.status(400).json({ message: 'Folder ID is required' });
    }

    const folder = await Folder.findOneAndDelete({ _id: req.params.id, creator: req.user.id });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: 'Server error while deleting folder', error: error.message });
  }
};

exports.getAllFoldersDetailed = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User authentication failed' });
    }

    const folders = await Folder.find({ creator: req.user.id })
      .populate({
        path: 'forms',
        select: 'title description createdAt',
        options: { sort: { createdAt: -1 } }
      });

    const detailedFolders = folders.map(folder => ({
      id: folder._id,
      name: folder.name,
      createdAt: folder.createdAt,
      formCount: folder.forms.length,
      forms: folder.forms.map(form => ({
        id: form._id,
        title: form.title,
        description: form.description,
        createdAt: form.createdAt
      }))
    }));

    res.json(detailedFolders);
  } catch (error) {
    console.error('Error fetching detailed folders:', error);
    res.status(500).json({ message: 'Server error while fetching detailed folders', error: error.message });
  }
};