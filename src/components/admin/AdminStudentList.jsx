import React from 'react';
import { useLibrary } from '../../contexts/LibraryContext';

const AdminStudentList = () => {
  const { users, getStudentBorrowed, getStudentHistory } = useLibrary();
  const students = users.filter(u => u.role === 'student');

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Registered Students</h2>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {students.length > 0 ? (
          <div className="space-y-4">
            {students.map(student => (
              <div key={student.id} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>Borrowed: {getStudentBorrowed(student.id).length}</span>
                    <span>History: {getStudentHistory(student.id).length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No students registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminStudentList;