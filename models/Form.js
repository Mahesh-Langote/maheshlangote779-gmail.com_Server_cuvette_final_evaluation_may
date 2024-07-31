const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fields: [
    {
      label: { type: String, required: true },
      type: { type: String, required: true },
      required: { type: Boolean, default: false },
      options: [String],
      errorMessage: { type: String, default: '' }
    },
  ],
  background: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
  isPublic: { type: Boolean, default: false },
  shareableLink: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);