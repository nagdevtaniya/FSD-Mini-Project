import React from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import { Book, Clock } from 'lucide-react'; // ✅ direct import from lucide-react
import Navbar from '../common/Navbar';

const StudentBorrowedBooks = () => {
  const { currentUser, books, requests, handleReturnBook } = useLibrary();
  const borrowedBooks = currentUser?.borrowed || [];
  const pendingRequests = requests.filter(
    (r) => r.studentId === currentUser?._id && r.status === 'approved'
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6 font-sans">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-4xl font-bold mb-10 text-gray-800 text-center">📚 My Borrowed Books</h2>

          {/* Borrowed Books Section */}
          {borrowedBooks.length === 0 ? (
            <p className="text-gray-600 text-center text-lg">
              You haven’t borrowed any books yet.
            </p>
          ) : (
            <ul className="space-y-6">
              {borrowedBooks.map((borrow) => {
                const book = books.find((b) => b._id === borrow.bookId);
                return (
                  <li
                    key={borrow.bookId}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 border-l-4 border-blue-500 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <Book className="w-10 h-10 text-blue-500 mt-1" />
                      <div>
                        <p className="text-xl font-semibold text-gray-800">
                          {book?.title || 'Unknown Book'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Borrowed on:{' '}
                          <span className="font-medium">
                            {borrow.borrowedDate
                              ? new Date(borrow.borrowedDate).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Due by:{' '}
                          <span className="font-medium">
                            {borrow.dueDate
                              ? new Date(borrow.dueDate).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleReturnBook(borrow.bookId)}
                      className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
                    >
                      Return
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Pending Pickup Section */}
          <h3 className="text-2xl font-bold mt-12 mb-6 text-gray-800 text-center flex justify-center items-center gap-2">
            <Clock className="w-7 h-7 text-gray-700" /> Pending Pickup Requests
          </h3>

          {pendingRequests.length === 0 ? (
            <p className="text-gray-600 text-center text-lg">No pending pickup requests.</p>
          ) : (
            <ul className="space-y-6">
              {pendingRequests.map((req) => {
                const book = books.find((b) => b._id === req.bookId);
                return (
                  <li
                    key={req._id}
                    className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <p className="text-lg font-semibold text-gray-800 mb-1">
                      {book?.title || 'Unknown Title'}
                    </p>
                    <p className="text-gray-700">
                      Your pickup token:{' '}
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">
                        {req.token || 'N/A'}
                      </code>
                    </p>
                    <p className="text-gray-700">
                      Pickup deadline:{' '}
                      <span className="font-medium">
                        {req.pickupDeadline
                          ? new Date(req.pickupDeadline).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </p>
                    <p className="text-sm italic text-gray-600 mt-1">
                      Please visit the library with this token before the deadline to collect your
                      book.
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentBorrowedBooks;
