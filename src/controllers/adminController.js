const mongoose = require('mongoose');
const Application = require('../models/Application');
const formatApplication = require('../utils/formatApplication');

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'firstName lastName email role')
      .populate('job', 'title location skills status postedBy')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: { applications: applications.map(formatApplication) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch applications.',
      error: error.message,
    });
  }
};

const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job id.',
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'firstName lastName email role')
      .populate('job', 'title location skills status postedBy')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: { applications: applications.map(formatApplication) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch applications for this job.',
      error: error.message,
    });
  }
};

module.exports = { getApplications, getApplicationsByJob };
