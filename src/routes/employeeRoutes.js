const express = require('express');
const {
  searchJobs,
  getOpenJob,
  applyToJob,
  getMyApplications,
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('employee'));

router.get('/jobs', searchJobs);
router.get('/jobs/:id', getOpenJob);
router.post('/jobs/:id/apply', applyToJob);
router.get('/applications', getMyApplications);

module.exports = router;
