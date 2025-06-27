import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Shared/Navbar'; // Make sure this path is correct
import Footer from './components/Shared/Footer'; // Make sure this path is correct

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)] max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
export default App;