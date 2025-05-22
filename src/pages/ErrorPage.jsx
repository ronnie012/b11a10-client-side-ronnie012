import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center px-4">
            <h1 className="text-6xl md:text-9xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl md:text-4xl font-semibold mb-6">Oops! Page Not Found.</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
            </p>
            <Link
                to="/"
                className="btn btn-primary btn-lg"
            >
                Go Back to Homepage
            </Link>
        </div>
    );
};

export default ErrorPage;