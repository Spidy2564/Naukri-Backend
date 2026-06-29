const formatJob = (job) => ({
  id: job._id,
  title: job.title,
  description: job.description,
  location: job.location,
  skills: job.skills,
  status: job.status,
  postedBy: job.postedBy,
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
});

module.exports = formatJob;
