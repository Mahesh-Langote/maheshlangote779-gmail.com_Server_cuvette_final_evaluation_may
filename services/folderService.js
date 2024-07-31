const Folder = require('../models/Folder');

exports.createFolder = async (name, userId) => {
  const folder = new Folder({ name, creator: userId });
  return folder.save();
};

exports.getFolders = async (userId) => {
  return Folder.find({ creator: userId });
};

exports.deleteFolder = async (folderId, userId) => {
  return Folder.findOneAndDelete({ _id: folderId, creator: userId });
};