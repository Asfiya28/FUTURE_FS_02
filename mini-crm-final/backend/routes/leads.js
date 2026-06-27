const express = require('express');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/leads
// @desc    Get all leads
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leads/stats
// @desc    Get lead statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contacted = await Lead.countDocuments({ status: 'Contacted' });
    const converted = await Lead.countDocuments({ status: 'Converted' });

    res.json({ total, new: newLeads, contacted, converted });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leads/:id
// @desc    Get single lead by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/leads
// @desc    Create a new lead
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, email, source, status, notes, followUpDate } = req.body;

  try {
    const newLead = new Lead({
      name,
      email,
      source,
      status: status || 'New',
      notes: notes || '',
      followUpDate: followUpDate || null
    });

    const lead = await newLead.save();
    res.status(201).json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update a lead
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, source, status, notes, followUpDate } = req.body;

  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.name = name || lead.name;
    lead.email = email || lead.email;
    lead.source = source || lead.source;
    lead.status = status || lead.status;
    lead.notes = notes !== undefined ? notes : lead.notes;
    lead.followUpDate = followUpDate !== undefined ? followUpDate : lead.followUpDate;

    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    await Lead.deleteOne({ _id: req.params.id });
    res.json({ message: 'Lead removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
