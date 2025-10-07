import React from 'react';
import { Icons } from '../../utils/icons';
import { useLibrary } from '../../contexts/LibraryContext';

const Navbar = () => {
  const { currentUser, setCurrentPage, handleLogout } = useLibrary();

  const isStudent = currentUser && currentUser.role === 'student';
  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <nav className="bg-white shadow-lg py-4 px-6 flex justify-between items-center fixed w-full z-20 top-0">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-800">Library System</h1>
        {isStudent && (
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">Student Panel</span>
        )}
        {isAdmin && (
          <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">Admin Panel</span>
        )}
      </div>
      <div className="flex items-center space-x-6">
        {isStudent && (
          <>
            <button onClick={() => setCurrentPage('bookList')} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Icons.BookOpen />
              <span className="ml-2">All Books</span>
            </button>
            <button onClick={() => setCurrentPage('borrowedBooks')} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Icons.Book />
              <span className="ml-2">My Books</span>
            </button>
            <button onClick={() => setCurrentPage('borrowHistory')} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Icons.History />
              <span className="ml-2">History</span>
            </button>
          </>
        )}
        {isAdmin && (
          <>
            <button onClick={() => setCurrentPage('adminDashboard')} className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <Icons.Home />
              <span className="ml-2">Dashboard</span>
            </button>
            <button onClick={() => setCurrentPage('adminBookList')} className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <Icons.BookOpen />
              <span className="ml-2">All Books</span>
            </button>
            <button onClick={() => setCurrentPage('addBook')} className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <Icons.AddBook />
              <span className="ml-2">Add Book</span>
            </button>
            <button onClick={() => setCurrentPage('bookRequests')} className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <Icons.Request />
              <span className="ml-2">Requests</span>
            </button>
            <button onClick={() => setCurrentPage('studentList')} className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <Icons.Users />
              <span className="ml-2">Students</span>
            </button>
          </>
        )}
        {currentUser && (
          <button
            onClick={handleLogout}
            className="flex items-center bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <Icons.Logout />
            <span className="ml-2">Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;