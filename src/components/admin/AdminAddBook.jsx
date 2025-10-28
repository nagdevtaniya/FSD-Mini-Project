import React, { useState } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';

const AdminAddBook = () => {
  const { handleAddBook } = useLibrary();
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
    const currentYear = new Date().getFullYear();

    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!author.trim()) newErrors.author = 'Author name is required.';
    if (!genre.trim()) newErrors.genre = 'Genre is required.';
    if (!year || year < 1900 || year > currentYear) newErrors.year = `Enter a valid year (1900-${currentYear}).`;
    if (!copies || copies < 1) newErrors.copies = 'At least one copy is required.';
    if (isbn && !/^\d+$/.test(isbn)) newErrors.isbn = 'ISBN should contain only digits.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      genre: genre.trim(),
      year: parseInt(year),
      copies: parseInt(copies),
      cover: cover.trim(),
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
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Add New Book</h2>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Book Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Book Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., The Great Gatsby"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., F. Scott Fitzgerald"
            />
            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">ISBN (optional)</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                errors.isbn ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 9780141182636"
            />
            {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
          </div>

          {/* Genre */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                errors.genre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Classic Literature"
            />
            {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
          </div>

          {/* Year & Copies Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Publication Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 1925"
              />
              {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Number of Copies</label>
              <input
                type="number"
                value={copies}
                onChange={(e) => setCopies(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                  errors.copies ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 5"
              />
              {errors.copies && <p className="text-red-500 text-sm mt-1">{errors.copies}</p>}
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Cover Image URL (optional)</label>
            <input
              type="url"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="e.g., https://example.com/book-cover.jpg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddBook;
