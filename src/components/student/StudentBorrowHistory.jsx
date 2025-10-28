import React, { useState, useEffect } from "react";
import { useLibrary } from "../../contexts/LibraryContext";
import { Icons } from "../../utils/icons";
import Navbar from "../common/Navbar";

const StudentBorrowHistory = () => {
  const { currentUser, books, handleDeleteHistory } = useLibrary();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.history && books.length > 0) {
      const historyWithDetails = currentUser.history.map((historyItem) => {
        const bookDetails = books.find((b) => b._id === historyItem.bookId);
        return {
          ...historyItem,
          title: bookDetails?.title || "Unknown Book",
          author: bookDetails?.author || "N/A",
        };
      });
      setHistory(historyWithDetails);
    }
  }, [currentUser, books]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
            Your Borrow History
          </h2>

          {history.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((item, index) => (
                <div
                  key={item._id || index}
                  className="relative bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-gray-100"
                >
                  {/* Subtle gradient top bar */}
                  <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-3 italic">by {item.author}</p>
                    <p className="text-gray-700 mb-5">
                      <span className="font-semibold text-gray-900">
                        Returned on:
                      </span>{" "}
                      {formatDate(item.returnedDate)}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        Returned
                      </span>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete the history for "${item.title}"?`
                            )
                          ) {
                            handleDeleteHistory(item.bookId);
                          }
                        }}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete history"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Icons.Book className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                You haven’t borrowed any books yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentBorrowHistory;
