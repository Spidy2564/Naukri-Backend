const mongoose = require('mongoose');

const JOB_STATUSES = ['open', 'closed'];

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    skills: {
      type: [{ type: String, trim: true }],
      required: [true, 'Skills are required'],
      validate: {
        validator: (skills) => skills.length > 0,
        message: 'At least one skill is required',
      },
    },
    status: {
      type: String,
      enum: {
        values: JOB_STATUSES,
        message: 'Status must be open or closed',
      },
      default: 'open',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
module.exports.JOB_STATUSES = JOB_STATUSES;
