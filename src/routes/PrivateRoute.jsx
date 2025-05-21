import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Show a loading indicator while auth state is being determined
        // This can be a more sophisticated spinner component if you have one
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (user) {
        // If user is authenticated, render the requested component
        return children;
    }

    // If user is not authenticated, redirect to login page
    // Pass the current location in state so user can be redirected back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
