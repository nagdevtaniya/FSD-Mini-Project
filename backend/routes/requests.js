const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const Book = require('../models/Book');

module.exports = (io) => {

router.get('/', async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'admin') {
      requests = await Request.find();
    } else {
      requests = await Request.find({ studentId: req.user.id });
    }
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { bookId, studentId } = req.body;
    const book = await Book.findById(bookId);
    const student = await User.findById(studentId);

    if (!book || book.copies <= 0) {
      return res.status(400).json({ message: 'Book is not available.' });
    }
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const newRequest = new Request({
      bookId,
      bookTitle: book.title,
      studentId,
      studentName: student.name,
      status: 'pending',
    });

    await newRequest.save();

    // Emit socket event to notify admins about new request
    io.emit('newRequest', {
      message: `New book borrow request from ${student.name} for "${book.title}".`,
      request: newRequest.toObject(),
    });

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status, pickupDeadline, token } = req.body;
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { status, pickupDeadline, token },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Emit socket event for real-time notification
    console.log('Status being set:', status);
    if (status === 'approved') {
      io.to(updatedRequest.studentId.toString()).emit('requestStatus', {
        message: `Your book request for "${updatedRequest.bookTitle}" has been approved. Your token is ${updatedRequest.token}.`,
        status: 'approved',
        token: updatedRequest.token,
        studentId: updatedRequest.studentId.toString(),
      });
    } else if (status === 'rejected') {
      console.log('Emitting rejection to student:', updatedRequest.studentId.toString());
      io.to(updatedRequest.studentId.toString()).emit('requestStatus', {
        message: `Your book request for "${updatedRequest.bookTitle}" has been rejected.`,
        status: 'rejected',
        studentId: updatedRequest.studentId.toString(),
      });
    } else if (status === 'checked_out') {
      // Emit event to notify clients about book checkout
      io.emit('bookCheckedOut', {
        message: `Book "${updatedRequest.bookTitle}" has been checked out by ${updatedRequest.studentName}.`,
        request: updatedRequest.toObject(),
      });
    }

    // Emit to admins for real-time update
    io.emit('requestUpdated', { request: updatedRequest.toObject() });

    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

return router;
}
