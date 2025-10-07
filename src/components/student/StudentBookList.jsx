import React from 'react';
import { Icons } from '../../utils/icons';
import { useLibrary } from '../../contexts/LibraryContext'; // Import the hook

const StudentBookList = () => {
  // Use the hook to get what you need
  const { books, handleBorrowBook, currentUser } = useLibrary();
  const isBorrowed = (bookId) => currentUser.borrowed.some(b => b.bookId === bookId);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Available Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <div key={book._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img src={book.cover} alt={book.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
              <p className="text-sm font-semibold text-gray-700">Copies Available: <span className={`${book.copies > 0 ? 'text-green-600' : 'text-red-600'}`}>{book.copies}</span></p>
              {book.copies > 0 && !isBorrowed(book._id) && (
                <button
                  onClick={() => handleBorrowBook(book._id)} // Use the function from context
                  className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <Icons.Borrow /> <span className="ml-2">Borrow</span>
                  </div>
                </button>
              )}
              {isBorrowed(book._id) && (
                <button
                  disabled
                  className="mt-4 w-full bg-gray-400 text-white font-semibold py-2 px-4 rounded-full cursor-not-allowed"
                >
                  <div className="flex items-center justify-center">
                    <Icons.Borrow /> <span className="ml-2">Already Borrowed</span>
                  </div>
                </button>
              )}
              {book.copies === 0 && !isBorrowed(book._id) && (
                <button
                  disabled
                  className="mt-4 w-full bg-red-400 text-white font-semibold py-2 px-4 rounded-full cursor-not-allowed"
                >
                  <div className="flex items-center justify-center">
                    <Icons.Borrow /> <span className="ml-2">Out of Stock</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentBookList;