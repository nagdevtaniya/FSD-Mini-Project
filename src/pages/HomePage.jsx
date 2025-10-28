import React from "react";
import { Icons } from "../utils/icons";
import { useLibrary } from "../contexts/LibraryContext";

const HomePage = () => {
  const { setCurrentPage } = useLibrary();

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_25%)] animate-pulse"></div>

      {/* Floating shapes */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 opacity-20 blur-3xl rounded-full animate-bounce-slow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 opacity-20 blur-3xl rounded-full animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
          Discover, Borrow & Learn
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">
          Dive into your digital library — modern, intuitive, and built for readers like you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={() => setCurrentPage("loginStudent")}
            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl px-8 py-3 rounded-full text-lg font-semibold transition transform hover:scale-105 shadow-lg"
          >
            <Icons.Student className="w-6 h-6 text-blue-400" />
            <span>Login as Student</span>
          </button>

          <button
            onClick={() => setCurrentPage("loginAdmin")}
            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl px-8 py-3 rounded-full text-lg font-semibold transition transform hover:scale-105 shadow-lg"
          >
            <Icons.Admin className="w-6 h-6 text-green-400" />
            <span>Login as Admin</span>
          </button>
        </div>
      </div>

      {/* Subtle floating book icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute text-6xl text-white/10 animate-float top-32 left-1/4">📘</div>
        <div className="absolute text-7xl text-white/10 animate-float-slow bottom-20 right-1/4">📚</div>
      </div>
    </div>
  );
};

export default HomePage;
