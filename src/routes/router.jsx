import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import App from '../App.jsx';
import HomePage from '../pages/HomePage.jsx';
import BrowseTasksPage from '../pages/BrowseTasksPage.jsx';
import AddTaskPage from '../pages/AddTaskPage.jsx';
import MyPostedTasksPage from '../pages/MyPostedTasksPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import TaskDetailPage from '../pages/TaskDetailPage.jsx';
import UpdateTaskPage from '../pages/UpdateTaskPage.jsx';
import PrivateRoute from './PrivateRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is the layout component with Navbar, Outlet, Footer
    // errorElement: <ErrorPage />, // Optional: Add an error page for route errors
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/browse-tasks",
        element: <BrowseTasksPage />,
      },
      {
        path: "/add-task",
        element: (
          <PrivateRoute>
            <AddTaskPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-posted-tasks",
        element: (
          <PrivateRoute>
            <MyPostedTasksPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/task/:taskId", // Dynamic route for task details
        element: <TaskDetailPage />, // Public for now, can be made private if needed
      },
      {
        path: "/update-task/:taskId", // Route for updating a task
        element: (
          <PrivateRoute>
            <UpdateTaskPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
]);

export default router;