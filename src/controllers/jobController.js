const mongoose = require('mongoose');
const Job = require('../models/Job');
const formatJob = require('../utils/formatJob');

const isJobOwner = (job, user) =>
  job.postedBy.toString() === user._id.toString() || user.role === 'admin';

const createJob = async (req, res) => {
  try {
    const { title, description, location, skills, status } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      skills,
      status,
      postedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Job created successfully.',
      data: { job: formatJob(job) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to create job.',
      error: error.message,
    });
  }
};

const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job id.',
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
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

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job id.',
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    if (!isJobOwner(job, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You can only update jobs you posted.',
      });
    }

    const { title, description, location, skills, status } = req.body;

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (location !== undefined) job.location = location;
    if (skills !== undefined) job.skills = skills;
    if (status !== undefined) job.status = status;

    await job.save();

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully.',
      data: { job: formatJob(job) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to update job.',
      error: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job id.',
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    if (!isJobOwner(job, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete jobs you posted.',
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Job deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to delete job.',
      error: error.message,
    });
  }
};

module.exports = { createJob, getJob, updateJob, deleteJob };
