const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const User = require('../models/user');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    console.log('Signup attempt for:', { username, email });
    const user = new User({ 
      username,
      email,
      encryptedEmail: email,
      password 
    });
    await user.save();
    console.log('User created:', {
      _id: user._id,
      username: user.username,
      email: user.email
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });
  try {
    // Verify encryption key exists
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY not set');
    }

    const user = await User.findOne({ email });
    console.log('User found:', user ? {
      _id: user._id,
      email: user.email,
      username: user.username
    } : 'No user found');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Debug route to view decrypted user data
router.get('/debug', async (req, res) => {
  try {
    const users = await User.find({});
    const decryptedUsers = users.map(user => ({
      _id: user._id,
      email: user.decryptEmail(),
      username: user.decryptUsername()
    }));
    res.json(decryptedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
