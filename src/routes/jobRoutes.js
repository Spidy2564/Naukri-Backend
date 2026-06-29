const express = require('express');
const { createJob, getJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('hiring_manager', 'admin'));

router.post('/', createJob);
router.get('/:id', getJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
