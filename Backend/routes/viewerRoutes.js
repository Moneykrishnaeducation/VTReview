const express = require('express');
const router = express.Router();

// Public Viewer Endpoints (No admin auth required)

// Get all verified brokers/companies
router.get('/companies', (req, res) => {
  res.json({ message: 'Public list of active brokers for the viewer panel' });
});

// Get company details by ID
router.get('/companies/:id', (req, res) => {
  res.json({ message: `Details for company ${req.params.id}` });
});

// Get company reviews
router.get('/companies/:id/reviews', (req, res) => {
  res.json({ message: `Approved reviews for company ${req.params.id}` });
});

// Submit a new review
router.post('/reviews', (req, res) => {
  res.json({ message: 'Review submitted and pending moderation' });
});

module.exports = router;
