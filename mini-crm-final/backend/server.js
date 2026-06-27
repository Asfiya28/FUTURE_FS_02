const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const User = require('./models/User');
const Lead = require('./models/Lead');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Mini CRM API is running' });
});

// Connect to MongoDB and seed data
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini-crm';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    // Seed admin user if not exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      await User.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword
      });
      console.log('Admin user created');
    }

    // Seed sample leads if collection is empty
    const leadCount = await Lead.countDocuments();
    if (leadCount === 0) {
      const sampleLeads = [
        {
          name: 'John Smith',
          email: 'john.smith@example.com',
          source: 'Website',
          status: 'New',
          notes: 'Interested in premium plan. Requested demo next week.',
          followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah.j@techcorp.com',
          source: 'Social Media',
          status: 'Contacted',
          notes: 'Spoke on LinkedIn. She wants pricing details.',
          followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Michael Chen',
          email: 'mchen@startup.io',
          source: 'Referral',
          status: 'Converted',
          notes: 'Signed contract on 15th. Onboarding scheduled.',
          followUpDate: null
        },
        {
          name: 'Emily Davis',
          email: 'emily.davis@agency.net',
          source: 'Email Campaign',
          status: 'New',
          notes: 'Downloaded whitepaper. Needs follow-up call.',
          followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Robert Wilson',
          email: 'rwilson@enterprise.com',
          source: 'Cold Call',
          status: 'Contacted',
          notes: 'Left voicemail. Waiting for callback.',
          followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Lisa Anderson',
          email: 'lisa.a@designstudio.com',
          source: 'Website',
          status: 'Converted',
          notes: 'Purchased annual subscription. Very satisfied.',
          followUpDate: null
        },
        {
          name: 'David Brown',
          email: 'dbrown@consulting.co',
          source: 'Referral',
          status: 'New',
          notes: 'Referred by existing client. High potential.',
          followUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Amanda Taylor',
          email: 'ataylor@retail.biz',
          source: 'Social Media',
          status: 'Contacted',
          notes: 'Had a video call. Discussed custom features.',
          followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        }
      ];
      await Lead.insertMany(sampleLeads);
      console.log('Sample leads seeded');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
