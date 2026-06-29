const formatApplication = (application) => ({
  id: application._id,
  applicant: application.applicant,
  job: application.job,
  status: application.status,
  createdAt: application.createdAt,
  updatedAt: application.updatedAt,
});

module.exports = formatApplication;
