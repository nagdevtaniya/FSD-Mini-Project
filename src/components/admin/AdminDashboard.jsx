import React from "react";
import { Icons } from "../../utils/icons";
import { useLibrary } from "../../contexts/LibraryContext";

const AdminDashboard = () => {
  const { books, users, requests, setCurrentPage } = useLibrary();

  const totalBooks = books.reduce(
    (sum, book) => sum + (book.totalCopies || 0),
    0
  );
  const totalStudents = users.filter((u) => u.role === "student").length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;

  // Map color names to fixed Tailwind classes
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  const Card = ({ title, value, color, icon, onClick }) => (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl p-8 flex flex-col items-center justify-center transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className={`p-5 rounded-full mb-4 ${colorMap[color]}`}>{icon}</div>
      <p className="text-gray-500 uppercase font-semibold tracking-wide text-sm">
        {title}
      </p>
      <p className="text-4xl font-extrabold text-gray-800 mt-2">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center border-b pb-4">
        Admin Dashboard
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <Card
          title="Total Books"
          value={totalBooks}
          color="blue"
          icon={<Icons.BookOpen className="w-10 h-10" />}
          onClick={() => setCurrentPage("adminBookList")}
        />
        <Card
          title="Total Students"
          value={totalStudents}
          color="purple"
          icon={<Icons.Users className="w-10 h-10" />}
          onClick={() => setCurrentPage("studentList")}
        />
        <Card
          title="Pending Requests"
          value={pendingRequests}
          color="yellow"
          icon={<Icons.Request className="w-10 h-10" />}
          onClick={() => setCurrentPage("bookRequests")}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
