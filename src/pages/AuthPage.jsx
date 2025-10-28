import React, { useState, useEffect } from "react";
import { useLibrary } from "../contexts/LibraryContext";

const AuthPage = ({ role }) => {
  const { handleLogin, handleRegister, showNotification } = useLibrary();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, [isLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      showNotification("Email and password are required.", "error");
      return;
    }

    if (isLogin) {
      handleLogin(email, password, role);
    } else {
      if (!name) {
        showNotification("Name is required for registration.", "error");
        return;
      }
      if (password !== confirmPassword) {
        showNotification("Passwords do not match.", "error");
        return;
      }
      const success = handleRegister(name, email, password, role);
      if (success) setIsLogin(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* White clean card */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md">
        <h2
          className={`text-3xl font-bold text-center mb-2 ${
            role === "student" ? "text-blue-600" : "text-green-600"
          }`}
        >
          {isLogin ? "Welcome Back" : "Join the Library"}
        </h2>
        <p className="text-center text-gray-600 mb-6 capitalize">
          {role} Portal
        </p>

        <div className="flex mb-8 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-sm font-semibold transition-all rounded-full ${
              isLogin
                ? role === "student"
                  ? "bg-blue-600 text-white"
                  : "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-sm font-semibold transition-all rounded-full ${
              !isLogin
                ? role === "student"
                  ? "bg-blue-600 text-white"
                  : "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-lg shadow-md transition-transform transform hover:scale-[1.02] ${
              role === "student"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setIsLogin(false)}
                className={`font-semibold cursor-pointer ${
                  role === "student" ? "text-blue-600" : "text-green-600"
                } hover:underline`}
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsLogin(true)}
                className={`font-semibold cursor-pointer ${
                  role === "student" ? "text-blue-600" : "text-green-600"
                } hover:underline`}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
