const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  form: { type: String, required: true }, 
  uniqueId: { type: String, required: true, unique: true },
  responses: [
    {
      field: String,
      value: mongoose.Schema.Types.Mixed,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);