const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: `You are trying to login as ${role}, but your account is registered as ${user.role}.` });
    }

    const token = jwt.sign({ id: user._id, role: user.role, sessionId: Math.random().toString(36) }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({ message: 'Logged in successfully!', user, token });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/users
// @desc    Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   PUT api/auth/:id
// @desc    Update a user
router.put('/:id', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Check if a book was returned (borrowed list shortened)
    if (req.body.borrowed && req.body.borrowed.length < currentUser.borrowed.length) {
      // Find the returned book id
      const returnedBookId = currentUser.borrowed.find(b => !req.body.borrowed.some(nb => nb.bookId === b.bookId))?.bookId;
      if (returnedBookId) {
        const Book = require('../models/Book');
        const returnedBook = await Book.findById(returnedBookId);
        if (returnedBook) {
          // Emit socket event for book return
          req.app.get('io').emit('bookReturned', {
            message: `Book "${returnedBook.title}" has been returned by ${currentUser.name}.`,
          });
        }
      }
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
