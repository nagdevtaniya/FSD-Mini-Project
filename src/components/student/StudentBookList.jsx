import React from "react";
import { BookOpen, CheckCircle, XCircle } from "lucide-react";
import { useLibrary } from "../../contexts/LibraryContext";

const StudentBookList = () => {
  const { books, handleBorrowBook, currentUser } = useLibrary();

  const isBorrowed = (bookId) =>
    currentUser?.borrowed?.some((b) => b.bookId === bookId);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Available Books
      </h2>

      {books.length === 0 ? (
        <p className="text-gray-600 text-center">No books available.</p>
      ) : (
        <div className="space-y-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 p-5"
            >
              {/* Left side — image and details */}
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-40 h-56 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                />

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    by <span className="font-medium">{book.author || "Unknown"}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    Copies Available:{" "}
                    <span
                      className={`${
                        book.copies > 0 ? "text-green-600" : "text-red-600"
                      } font-semibold`}
                    >
                      {book.copies}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right side — button */}
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                {book.copies > 0 && !isBorrowed(book._id) && (
                  <button
                    onClick={() => handleBorrowBook(book._id)}
                    className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen size={18} />
                    Borrow
                  </button>
                )}

                {isBorrowed(book._id) && (
                  <button
                    disabled
                    className="flex items-center gap-2 bg-gray-400 text-white font-semibold px-6 py-2 rounded-full cursor-not-allowed"
                  >
                    <CheckCircle size={18} />
                    Already Borrowed
                  </button>
                )}

                {book.copies === 0 && !isBorrowed(book._id) && (
                  <button
                    disabled
                    className="flex items-center gap-2 bg-red-400 text-white font-semibold px-6 py-2 rounded-full cursor-not-allowed"
                  >
                    <XCircle size={18} />
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentBookList;
