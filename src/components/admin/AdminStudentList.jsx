import React from "react";
import { useLibrary } from "../../contexts/LibraryContext";

const AdminStudentList = () => {
  const { users, getStudentBorrowed, getStudentHistory } = useLibrary();
  const students = users.filter((u) => u.role === "student");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center border-b pb-4">
          Registered Students
        </h2>

        {students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-200 text-indigo-900 rounded-full">
                      ID: {student.id?.slice(0, 6) || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-sm font-medium mt-4">
                  <span className="text-blue-700">
                    Borrowed:{" "}
                    <span className="font-bold text-blue-900">
                      {getStudentBorrowed(student.id).length}
                    </span>
                  </span>
                  <span className="text-indigo-700">
                    History:{" "}
                    <span className="font-bold text-indigo-900">
                      {getStudentHistory(student.id).length}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10 text-lg">
            No students registered yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminStudentList;
