import React from 'react';
import { Icons } from '../utils/icons';
import { useLibrary } from '../contexts/LibraryContext'; // Fixed import path

const HomePage = () => {
  const { setCurrentPage } = useLibrary();

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1681488394409-5614ef55488c?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 text-center text-white p-8">
        <h1 className="text-6xl font-extrabold mb-4 animate-fade-in-down drop-shadow-lg">Welcome to Library System</h1>
        <p className="text-xl mb-8 font-light drop-shadow-md">Your Digital Library Companion</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <button
            onClick={() => setCurrentPage('loginStudent')}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg space-x-2" // ADDED space-x-2 HERE
          >
            <Icons.Student />
            <span>Login as Student</span> {/* REMOVED ml-2 HERE */}
          </button>
          <button
            onClick={() => setCurrentPage('loginAdmin')}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg space-x-2" // ADDED space-x-2 HERE
          >
            <Icons.Admin />
            <span>Login as Admin</span> {/* REMOVED ml-2 HERE */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;