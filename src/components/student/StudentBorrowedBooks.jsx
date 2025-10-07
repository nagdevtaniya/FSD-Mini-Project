import React, { useState, useEffect } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';

const StudentBorrowedBooks = () => {
  const { currentUser, books, requests, handleReturnBook } = useLibrary();
  const borrowedBooks = currentUser?.borrowed || [];
  const pendingRequests = requests.filter(r => r.studentId === currentUser?._id && r.status === 'approved');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Borrowed Books</h2>

      {borrowedBooks.length === 0 && <p>You have no borrowed books currently.</p>}

      <ul>
        {borrowedBooks.map(borrow => {
          const book = books.find(b => b._id === borrow.bookId);
          return (
            <li
              key={borrow.bookId}
              className="mb-4 bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{book?.title || 'Unknown Book'}</p>
                <p>Borrowed on: {borrow.borrowedDate ? new Date(borrow.borrowedDate).toLocaleDateString() : 'N/A'}</p>
                <p>Due by: {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <button
                onClick={() => handleReturnBook(borrow.bookId)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Return
              </button>
            </li>
          );
        })}
      </ul>

      <h3 className="text-xl font-semibold mt-10 mb-4">Pending Pickup Requests</h3>
      {pendingRequests.length === 0 && <p>No pending pickup requests.</p>}
      <ul>
        {pendingRequests.map(req => {
            const book = books.find(b => b._id === req.bookId);
            return (
              <li key={req._id} className="mb-4 bg-yellow-100 p-4 rounded shadow">
                <p><strong>{book?.title || 'Unknown Title'}</strong></p>
                <p>Your pickup token: <code className="bg-gray-200 px-2 py-1 rounded">{req.token || 'N/A'}</code></p>
                <p>Pickup deadline: {req.pickupDeadline ? new Date(req.pickupDeadline).toLocaleDateString() : 'N/A'}</p>
                <p className="italic">Please visit the library with this token before the deadline to collect your book.</p>
              </li>
            );
        })}
      </ul>
    </div>
  );
};

export default StudentBorrowedBooks;