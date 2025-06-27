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
import DashboardPage from '../pages/DashboardPage.jsx';
import ErrorPage from '../pages/ErrorPage.jsx';
import PrivateRoute from './PrivateRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
        path: "/task/:taskId", // Dynamic route for task details
        element: <TaskDetailPage />, // Public for now, can be made private if needed
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <MyPostedTasksPage />,
          },
          {
            path: "add-task",
            element: <AddTaskPage />,
          },
          {
            path: "my-posted-tasks",
            element: <MyPostedTasksPage />,
          },
          {
            path: "update-task/:taskId",
            element: <UpdateTaskPage />,
          },
        ],
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
  {
    path: "*",
    element: <ErrorPage />
  }
]);

export default router;