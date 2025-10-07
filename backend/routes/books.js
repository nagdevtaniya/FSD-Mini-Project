const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    copies: req.body.copies,
    totalCopies: req.body.copies,
    cover: req.body.cover,
  });
  try {
    const newBook = await book.save();

    // Emit socket event to notify clients about new book
    req.app.get('io').emit('newBook', {
      message: `New book "${newBook.title}" has been added.`,
      book: newBook,
    });

    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Emit socket event to notify clients about book update
    req.app.get('io').emit('bookUpdated', {
      message: `Book "${updatedBook.title}" has been updated.`,
      book: updatedBook,
    });

    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;