import React, { useState } from "react";
import { useLibrary } from "../../contexts/LibraryContext";
import { Edit, Trash, Check, X } from "lucide-react";

const AdminBookList = () => {
  const { books, handleUpdateBook, handleRemoveBook } = useLibrary();
  const [editingBook, setEditingBook] = useState(null);
  const [updatedCopies, setUpdatedCopies] = useState("");
  const [updatedTotalCopies, setUpdatedTotalCopies] = useState("");

  const startEdit = (book) => {
    setEditingBook(book);
    setUpdatedCopies(book.copies);
    setUpdatedTotalCopies(book.totalCopies);
  };

  const handleSave = () => {
    const updatedBook = {
      ...editingBook,
      copies: Number(updatedCopies),
      totalCopies: Number(updatedTotalCopies),
    };
    handleUpdateBook(updatedBook);
    setEditingBook(null);
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Books in Library</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {books.length > 0 ? (
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book._id}
                className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-lg shadow-md"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      Total Copies:{" "}
                      <span className="text-blue-600">{book.totalCopies}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Available:{" "}
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

                <div className="flex space-x-3">
                  <button
                    onClick={() => startEdit(book)}
                    className="flex items-center bg-green-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update
                  </button>
                  <button
                    onClick={() => handleRemoveBook(book._id)}
                    className="flex items-center bg-red-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No books available in the library.
          </p>
        )}
      </div>

      {/* Update Modal */}
      {editingBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Update Book Stock
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Copies
                </label>
                <input
                  type="number"
                  value={updatedCopies}
                  onChange={(e) => setUpdatedCopies(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Copies
                </label>
                <input
                  type="number"
                  value={updatedTotalCopies}
                  onChange={(e) => setUpdatedTotalCopies(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setEditingBook(null)}
                className="flex items-center bg-gray-400 text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-500 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookList;
