const mongoose = require('mongoose');

const APPLICATION_STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'];

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUSES,
        message: 'Status must be pending, reviewed, accepted, or rejected',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
module.exports.APPLICATION_STATUSES = APPLICATION_STATUSES;
