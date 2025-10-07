import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from react-dom/client for React 18+
import './index.css'; // Your main CSS file with Tailwind directives
import App from './App'; // Import the main App component

// Create a root and render your App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
