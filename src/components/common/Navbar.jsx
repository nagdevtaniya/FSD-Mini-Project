import React from "react";
import { Icons } from "../../utils/icons";
import { useLibrary } from "../../contexts/LibraryContext";

const Navbar = () => {
  const { currentUser, setCurrentPage, handleLogout } = useLibrary();

  const isStudent = currentUser?.role === "student";
  const isAdmin = currentUser?.role === "admin";

  return (
    <nav className="fixed top-0 w-full z-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg backdrop-blur-md text-white">
      <div className="flex justify-between items-center px-8 py-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <Icons.BookOpen className="w-7 h-7 text-white" />
          <h1 className="text-2xl font-bold tracking-tight">Library System</h1>
          {isStudent && (
            <span className="bg-blue-200 text-blue-900 text-xs font-semibold px-2 py-0.5 rounded-full">
              Student
            </span>
          )}
          {isAdmin && (
            <span className="bg-green-200 text-green-900 text-xs font-semibold px-2 py-0.5 rounded-full">
              Admin
            </span>
          )}
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {isStudent && (
            <>
              <button
                onClick={() => setCurrentPage("bookList")}
                className="flex items-center gap-2 hover:text-yellow-300 transition-all"
              >
                <Icons.BookOpen size={18} />
                <span>All Books</span>
              </button>
              <button
                onClick={() => setCurrentPage("borrowedBooks")}
                className="flex items-center gap-2 hover:text-yellow-300 transition-all"
              >
                <Icons.Book size={18} />
                <span>My Books</span>
              </button>
              <button
                onClick={() => setCurrentPage("borrowHistory")}
                className="flex items-center gap-2 hover:text-yellow-300 transition-all"
              >
                <Icons.History size={18} />
                <span>History</span>
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button
                onClick={() => setCurrentPage("adminDashboard")}
                className="flex items-center gap-2 hover:text-lime-300 transition-all"
              >
                <Icons.Home size={18} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentPage("adminBookList")}
                className="flex items-center gap-2 hover:text-lime-300 transition-all"
              >
                <Icons.BookOpen size={18} />
                <span>Books</span>
              </button>
              <button
                onClick={() => setCurrentPage("addBook")}
                className="flex items-center gap-2 hover:text-lime-300 transition-all"
              >
                <Icons.AddBook size={18} />
                <span>Add Book</span>
              </button>
              <button
                onClick={() => setCurrentPage("bookRequests")}
                className="flex items-center gap-2 hover:text-lime-300 transition-all"
              >
                <Icons.Request size={18} />
                <span>Requests</span>
              </button>
              <button
                onClick={() => setCurrentPage("studentList")}
                className="flex items-center gap-2 hover:text-lime-300 transition-all"
              >
                <Icons.Users size={18} />
                <span>Students</span>
              </button>
            </>
          )}

          {currentUser && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
            >
              <Icons.Logout size={18} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
