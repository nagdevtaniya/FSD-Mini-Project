import React from 'react';

const Notification = ({ message, type }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const textColor = 'text-white';
  
  return (
    <div
      className={`fixed top-20 right-5 ${bgColor} ${textColor} px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-300 ease-in-out transform`}
      style={{ animation: 'fadeInOut 5s forwards' }}
    >
      <p className="font-medium">{message}</p>
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Notification;