import React, { useState } from 'react';
import { Icons } from '../../utils/icons';
import { useLibrary } from '../../contexts/LibraryContext';

const AdminBookList = () => {
  const { books, handleUpdateBook, handleRemoveBook, showNotification } = useLibrary();
  const [editingBook, setEditingBook] = useState(null);
  const [updatedCopies, setUpdatedCopies] = useState(0);
  const [updatedTotalCopies, setUpdatedTotalCopies] = useState(0);
  const [removingBook, setRemovingBook] = useState(null);

  const startEditing = (book) => {
    setEditingBook(book);
    setUpdatedCopies(book.copies);
    setUpdatedTotalCopies(book.totalCopies);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (updatedTotalCopies < updatedCopies) {
      showNotification("Total copies cannot be less than available copies.", "error");
      return;
    }
    const updatedBook = {
      ...editingBook,
      copies: parseInt(updatedCopies, 10),
      totalCopies: parseInt(updatedTotalCopies, 10),
    };
    handleUpdateBook(updatedBook);
    setEditingBook(null);  
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">All Books in Library</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <div key={book._id} className="bg-white rounded-xl shadow-lg overflow-hidden relative">
            <img src={book.cover} alt={book.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
              <p className="text-sm font-semibold text-gray-700">Total Copies: <span className="text-blue-600">{book.totalCopies}</span></p>
              <p className="text-sm font-semibold text-gray-700">Available: <span className={`${book.copies > 0 ? 'text-green-600' : 'text-red-600'}`}>{book.copies}</span></p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => startEditing(book)}
                  className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Icons.Edit />
                  <span className="ml-2">Update</span>
                </button>
                <button
                  onClick={() => setRemovingBook(book)}
                  className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Icons.Trash />
                  <span className="ml-2">Remove</span>
                </button>
              </div>
            </div>
            {editingBook && editingBook._id === book._id && (
              <div className="absolute inset-0 bg-white bg-opacity-95 p-6 flex flex-col justify-center items-center">
                <form onSubmit={handleUpdateSubmit} className="w-full">
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">Update Stock</h4>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Total Copies</label>
                    <input
                      type="number"
                      value={updatedTotalCopies}
                      onChange={(e) => setUpdatedTotalCopies(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                      min="0"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Available Copies</label>
                    <input
                      type="number"
                      value={updatedCopies}
                      onChange={(e) => setUpdatedCopies(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                      min="0"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBook(null)}
                      className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            {removingBook && removingBook._id === book._id && (
              <div className="absolute inset-0 bg-white bg-opacity-95 p-6 flex flex-col justify-center items-center">
                <h4 className="text-2xl font-bold text-gray-800 mb-4">Remove Book</h4>
                <p className="text-gray-600 mb-6">Are you sure you want to remove "{removingBook.title}"? This action cannot be undone.</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      handleRemoveBook(removingBook._id);
                      setRemovingBook(null);
                    }}
                    className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Confirm Remove
                  </button>
                  <button
                    onClick={() => setRemovingBook(null)}
                    className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookList;