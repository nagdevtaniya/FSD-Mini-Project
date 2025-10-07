import React from 'react';
import ReactDOM from 'react-dom';
import { LibraryProvider, useLibrary } from './contexts/LibraryContext';
import Navbar from './components/common/Navbar';
import Notification from './components/common/Notifications';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import StudentBookList from './components/student/StudentBookList';
import StudentBorrowedBooks from './components/student/StudentBorrowedBooks';
import StudentBorrowHistory from './components/student/StudentBorrowHistory';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminBookList from './components/admin/AdminBookList';
import AdminAddBook from './components/admin/AdminAddBook';
import AdminBookRequests from './components/admin/AdminBookRequests';
import AdminStudentList from './components/admin/AdminStudentList';

const AppContent = () => {
  const { 
    currentPage,
    setCurrentPage,
    currentUser,
    notification,
    setNotification,
    handleLogin,
    handleRegister,
  } = useLibrary();

  const renderPage = () => {
    if (!currentUser) {
      switch (currentPage) {
        case 'loginStudent':
          return <AuthPage role="student" onLogin={handleLogin} onRegister={handleRegister} onSwitch={() => setCurrentPage('home')} />;
        case 'loginAdmin':
          return <AuthPage role="admin" onLogin={handleLogin} onRegister={handleRegister} onSwitch={() => setCurrentPage('home')} />;
        default:
          return <HomePage onNavigate={setCurrentPage} />;
      }
    } else if (currentUser.role === 'student') {
      switch (currentPage) {
        case 'bookList':
          // No props needed, component gets data from context
          return <StudentBookList />;
        case 'borrowedBooks':
          // No props needed
          return <StudentBorrowedBooks />;
        case 'borrowHistory':
          // No props needed
          return <StudentBorrowHistory />;
        default:
          return <StudentBookList />;
      }
    } else if (currentUser.role === 'admin') {
      switch (currentPage) {
        case 'addBook':
          return <AdminAddBook />;
        case 'adminBookList':
          return <AdminBookList />;
        case 'bookRequests':
          return <AdminBookRequests />;
        case 'studentList':
          return <AdminStudentList />;
        default:
          return <AdminDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {currentUser && <Navbar />}
      <div className={`${currentUser ? 'pt-20' : ''} pb-10`}>
        {renderPage()}
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
};

export default App;