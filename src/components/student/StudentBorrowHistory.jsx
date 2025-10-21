import React, { useState, useEffect } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import { Icons } from '../../utils/icons';
import Navbar from '../common/Navbar';

const StudentBorrowHistory = () => {
  const { currentUser, books, handleDeleteHistory } = useLibrary();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.history && books.length > 0) {
      const historyWithDetails = currentUser.history.map(historyItem => {
        const bookDetails = books.find(b => b._id === historyItem.bookId);
        return {
          ...historyItem,
          title: bookDetails?.title || 'Unknown Book',
          author: bookDetails?.author || 'N/A'
        };
      });
      setHistory(historyWithDetails);
    }
  }, [currentUser, books]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8 font-sans bg-gray-50 min-h-screen">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Borrow History</h2>
        <div className="bg-white shadow-lg rounded-xl p-6">
          {history.length > 0 ? (
            <div className="space-y-6">
              {history.map((item, index) => (
                <div key={item._id || index} className="flex flex-col sm:flex-row items-start sm:items-center p-6 rounded-lg bg-yellow-50 border-l-4 border-yellow-500 hover:bg-yellow-100 transition-colors shadow-sm">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {item.author}</p>
                    <p className="text-sm text-gray-700"><strong>Returned:</strong> <span className="font-medium">{formatDate(item.returnedDate)}</span></p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-auto flex items-center space-x-2">
                    <span
                      className="inline-block px-4 py-2 rounded-full font-semibold text-sm bg-yellow-200 text-yellow-800"
                    >
                      Returned
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete the history for "${item.title}"?`)) {
                          handleDeleteHistory(item.bookId);
                        }
                      }}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete history"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-10 text-lg">No borrowing history found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentBorrowHistory;