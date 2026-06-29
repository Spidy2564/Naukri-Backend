const express = require('express');
const { getApplications, getApplicationsByJob } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/applications', getApplications);
router.get('/applications/job/:jobId', getApplicationsByJob);

module.exports = router;
