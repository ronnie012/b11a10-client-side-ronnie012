import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // We'll create this next, it will be empty for now
import AuthProvider from './contexts/AuthProvider.jsx';
import { RouterProvider } from "react-router-dom";
import router from './routes/router.jsx'; // Import the router from its new location

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} /> {/* Provide the imported router */}
    </AuthProvider>
  </React.StrictMode>
);