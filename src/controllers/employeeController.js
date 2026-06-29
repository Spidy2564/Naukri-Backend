const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');
const formatJob = require('../utils/formatJob');
const formatApplication = require('../utils/formatApplication');

const searchJobs = async (req, res) => {
  try {
    const { search, location, skill } = req.query;

    const filter = { status: 'open' };

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (skill) {
      filter.skills = { $regex: skill, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: { jobs: jobs.map(formatJob) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to search jobs.',
      error: error.message,
    });
  }
};

const getOpenJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job id.',
      });
    }

    const job = await Job.findOne({ _id: id, status: 'open' });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer open.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { job: formatJob(job) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch job.',
      error: error.message,
    });
  }
};

const applyToJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job id.',
      });
    }

    const job = await Job.findOne({ _id: id, status: 'open' });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer open.',
      });
    }

    const existingApplication = await Application.findOne({
      applicant: req.user._id,
      job: id,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied to this job.',
      });
    }

    const application = await Application.create({
      applicant: req.user._id,
      job: id,
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: { application: formatApplication(application) },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied to this job.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to submit application.',
      error: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title location skills status')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: { applications: applications.map(formatApplication) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch your applications.',
      error: error.message,
    });
  }
};

module.exports = { searchJobs, getOpenJob, applyToJob, getMyApplications };
