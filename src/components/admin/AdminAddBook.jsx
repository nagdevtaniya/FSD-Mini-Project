import React, { useState } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';

const AdminAddBook = () => {
  const { handleAddBook, showNotification } = useLibrary();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [copies, setCopies] = useState('');
  const [cover, setCover] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!author.trim()) newErrors.author = 'Author Name is required.';
    if (!genre.trim()) newErrors.genre = 'Genre is required.';
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    if (!year || isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) newErrors.year = `Valid publication year (1900-${currentYear}) is required.`;
    if (!copies || parseInt(copies) < 1) newErrors.copies = 'At least 1 copy is required.';
    if (isbn && !/^\d+$/.test(isbn)) newErrors.isbn = 'ISBN must contain only numbers.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const bookData = {
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        genre: genre.trim(),
        year: parseInt(year),
        copies: parseInt(copies),
        cover: cover.trim() || ''
      };
      handleAddBook(bookData);
      setTitle('');
      setAuthor('');
      setIsbn('');
      setGenre('');
      setYear('');
      setCopies('');
      setCover('');
      setErrors({});
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Add New Book</h2>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Book Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g., The Hitchhiker's Guide to the Galaxy"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${errors.author ? 'border-red-500' : ''}`}
              placeholder="e.g., Douglas Adams"
            />
            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">ISBN (optional)</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${errors.isbn ? 'border-red-500' : ''}`}
              placeholder="e.g., 9780345391803"
            />
            {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${errors.genre ? 'border-red-500' : ''}`}
              placeholder="e.g., Science Fiction"
            />
            {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Publication Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${errors.year ? 'border-red-500' : ''}`}
              min="1900"
              placeholder="e.g., 1979"
            />
            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Number of Copies</label>
            <input
              type="number"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${errors.copies ? 'border-red-500' : ''}`}
              min="1"
            />
            {errors.copies && <p className="text-red-500 text-sm mt-1">{errors.copies}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Cover Image URL (optional)</label>
            <input
              type="url"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              placeholder="e.g., https://example.com/book-cover.jpg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"
            disabled={Object.keys(errors).length > 0}
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddBook;
