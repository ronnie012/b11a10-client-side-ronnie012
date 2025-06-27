import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="container mx-auto my-8 flex max-w-[1220px] min-h-[calc(100vh-16rem)] bg-base-100 rounded-xl shadow-xl overflow-hidden border-2 border-base-300">
      <aside className="w-64 bg-base-200 text-base-content p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="add-task" 
                className={({ isActive }) => 
                  `block py-2 px-4 rounded-md transition duration-200 ease-in-out 
                  ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`
                }
              >
                Add Task
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/dashboard"
                end
                className={({ isActive }) => 
                  `block py-2 px-4 rounded-md transition duration-200 ease-in-out 
                  ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`
                }
              >
                My Posted Tasks
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 text-base-content">
        <Outlet /> {/* Nested routes will render here */}
      </main>
    </div>
  );
};

export default DashboardPage;
