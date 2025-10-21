import React from 'react';
import { Icons } from '../../utils/icons';
import { useLibrary } from '../../contexts/LibraryContext';

const AdminDashboard = () => {
  const { books, users, requests, setCurrentPage } = useLibrary();

  const totalBooks = books.reduce((sum, book) => sum + (book.totalCopies || 0), 0);
  const totalStudents = users.filter(u => u.role === 'student').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  const Card = ({ title, value, color, icon, onClick }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105 cursor-pointer`}
      onClick={onClick}
    >
      <div className={`p-4 rounded-full bg-${color}-100 text-${color}-600 mb-4`}>
        {icon}
      </div>
      <p className="text-gray-500 uppercase font-semibold text-sm">{title}</p>
      <p className="text-4xl font-bold text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Total Books"
          value={totalBooks}
          color="blue"
          icon={<Icons.BookOpen className="w-8 h-8" />}
          onClick={() => setCurrentPage('adminBookList')}
        />
        <Card
          title="Total Students"
          value={totalStudents}
          color="purple"
          icon={<Icons.Users className="w-8 h-8" />}
          onClick={() => setCurrentPage('studentList')}
        />
        <Card
          title="Pending Requests"
          value={pendingRequests}
          color="yellow"
          icon={<Icons.Request className="w-8 h-8" />}
          onClick={() => setCurrentPage('bookRequests')}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;