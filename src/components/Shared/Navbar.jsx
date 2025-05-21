import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Import useAuth
import Swal from 'sweetalert2';

const Navbar = () => {
    const { user, logOut, loading } = useAuth(); // Get user, logOut function, and loading state
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    title: 'Logged Out!',
                    text: 'You have been logged out successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/login'); // Redirect to login page after logout
            })
            .catch(error => {
                console.error("Logout error:", error);
                Swal.fire({
                    title: 'Error!',
                    text: `Logout failed: ${error.message}`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    return (
        <header className="bg-base-200 shadow-md">
            <div className="navbar max-w-7xl mx-auto">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost text-xl">GigConnect</Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/browse-tasks">Browse Tasks</Link></li>
                        {/* These will become private/conditional later */}
                        <li><Link to="/add-task">Add Task</Link></li>
                        <li><Link to="/my-posted-tasks">My Posted Tasks</Link></li>
                    </ul>
                    {/* Auth-dependent section */}
                    <div className="ml-4 flex items-center" style={{ minHeight: '32px' }}> {/* minHeight to prevent layout shift */}
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span> /* DaisyUI spinner */
                        ) : user ? (
                            <> {/* Logged-in user UI */}
                                {user.photoURL && (
                                    <img src={user.photoURL} alt={user.displayName || 'User'} title={user.displayName || user.email} className="w-8 h-8 rounded-full mr-2" />
                                )}
                                <span className="mr-3 font-semibold hidden sm:inline">{user.displayName || user.email}</span>
                                <button onClick={handleLogout} className="btn btn-sm btn-outline btn-error">Logout</button>
                            </>
                        ) : (
                            <> {/* Logged-out user UI */}
                                <Link to="/login" className="btn btn-sm btn-outline btn-primary mr-2">Login</Link>
                                <Link to="/signup" className="btn btn-sm btn-primary">Signup</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;