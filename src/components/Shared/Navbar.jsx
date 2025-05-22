import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Import useAuth
import Swal from 'sweetalert2';

const Navbar = () => {
    const { user, logOut, loading } = useAuth(); // Get user, logOut function, and loading state
    const navigate = useNavigate();
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const avatarLabelRef = useRef(null); // Ref for the avatar label

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    const handleThemeToggle = () => {
        setCurrentTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(prevIsOpen => {
            const newIsOpen = !prevIsOpen;
            if (!newIsOpen && avatarLabelRef.current) {
                // If closing the menu, explicitly blur the avatar label
                avatarLabelRef.current.blur();
            }
            return newIsOpen;
        });
    };

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
                setIsUserMenuOpen(false); // Close dropdown on logout
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

    const navLinks = (
        <>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>Home</NavLink></li>
            <li><NavLink to="/browse-tasks" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>Browse Tasks</NavLink></li>
            {user && (
                <>
                    <li><NavLink to="/add-task" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>Add Task</NavLink></li>
                    <li><NavLink to="/my-posted-tasks" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>My Posted Tasks</NavLink></li>
                </>
            )}
        </>
    );


    return (
        <header className="bg-base-100 shadow-md sticky top-0 z-50"> {/* Changed bg-base-200 to bg-base-100 for better theme contrast, added sticky, top-0, z-50 */}
            <div className="navbar max-w-7xl mx-auto">
                <div className="navbar-start"> {/* Changed flex-1 to navbar-start */}
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {navLinks}
                        </ul>
                    </div>
                    <Link to="/" className="btn btn-ghost text-xl normal-case">GigConnect</Link> {/* Added normal-case */}
                </div>
                <div className="navbar-center hidden lg:flex"> {/* Added navbar-center */}
                    <ul className="menu menu-horizontal px-1">
                        {navLinks}
                    </ul>
                </div>
                <div className="navbar-end space-x-2"> {/* Changed flex-none to navbar-end, reduced space-x-3 to space-x-2 */}
                    {/* Theme Toggle Button */}
                    <label className="swap swap-rotate btn btn-ghost btn-circle">
                        <input
                            type="checkbox"
                            onChange={handleThemeToggle}
                            checked={currentTheme === 'dark'}
                            aria-label="Toggle theme"
                        />
                        {/* sun icon */}
                        <svg className="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29l.71-.71a1,1,0,0,0,0-1.41,1,1,0,0,0-1.41,0l-.71.71A1,1,0,0,0,5.64,7.05ZM12,15a5,5,0,1,0,5-5A5,5,0,0,0,12,15Zm12.71,1.29a1,1,0,0,0-.71.29l-.71.71a1,1,0,1,0,1.41,1.41l.71-.71a1,1,0,0,0,0-1.41ZM20,12a1,1,0,0,0-1-1H18a1,1,0,0,0,0,2h1A1,1,0,0,0,20,12ZM14.36,20.95a1,1,0,0,0,.7-.29l.71-.71a1,1,0,0,0-1.41-1.41l-.71.71a1,1,0,0,0,.71,1.71ZM12,19a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19Z" /></svg>
                        {/* moon icon */}
                        <svg className="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22a10.14,10.14,0,0,0,9.55,9.55A8.14,8.14,0,0,1,12.14,19.69Z" /></svg>
                    </label>

                    {/* Auth-dependent section */}
                    <div style={{ minHeight: '32px' }}> {/* Removed flex items-center as dropdown handles alignment */}
                        {loading && !user ? ( // Show spinner only if loading and no user yet (to avoid flash during logout)
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : user ? (
                            <div className={`dropdown dropdown-end ${isUserMenuOpen ? 'dropdown-open' : ''}`}>
                                <label 
                                    ref={avatarLabelRef}
                                    tabIndex={0} 
                                    className="btn btn-ghost btn-circle avatar" 
                                    title={user.displayName || 'User menu'}
                                    onClick={toggleUserMenu} // Toggle on click
                                    onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 150)} // Close on blur with a small delay
                                >
                                    <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"> {/* Added ring for better visibility */}
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName || 'User'} />
                                        ) : (
                                            <span className="text-xl">{user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</span> // Fallback to initial
                                        )}
                                    </div>
                                </label>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3  z-[1] p-2 shadow bg-green-300 rounded-box w-52"
                                    // No onClick needed here if items navigate or call functions that close the menu
                                >
                                    <li className="px-4 py-2 text-lg font-semibold">{user.displayName || user.email}</li>
                                    <li><button onClick={handleLogout} className="btn btn-sm btn-ghost text-error text-bold text-lg w-full pl-4 justify-start">Logout</button></li>
                                </ul>
                            </div>
                        ) : (
                            <>
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
