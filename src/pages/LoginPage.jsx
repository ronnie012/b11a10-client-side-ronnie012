import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Custom hook to access AuthContext
import Swal from 'sweetalert2';


const LoginPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { signInUser, signInWithGoogle } = useAuth(); // Add signInWithGoogle
    const navigate = useNavigate();
    const location = useLocation();

    // Determine where to redirect after login
    // If the user was redirected to login from a private route, `location.state?.from?.pathname` will have the intended path.
    // Otherwise, default to the homepage.
    const from = location.state?.from?.pathname || "/";

    const onSubmit = data => {
        console.log(data);
        signInUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log('User logged in:', loggedUser);
                Swal.fire({
                    title: 'Success!',
                    text: 'Logged in successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                reset(); // Reset form fields
                navigate(from, { replace: true }); // Navigate to the intended page or home
            })
            .catch(error => {
                console.error("Login error:", error);
                Swal.fire({
                    title: 'Error!',
                    text: `Login failed: ${error.message}`, // Or a more user-friendly message
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    const handleGoogleLogin = () => {
        signInWithGoogle()
            .then(result => {
                const loggedUser = result.user;
                console.log('User logged in with Google:', loggedUser);
                Swal.fire({
                    title: 'Success!',
                    text: 'Logged in with Google successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                // Navigate to the intended page or home, similar to email/password login
                navigate(from, { replace: true }); 
            })
            .catch(error => {
                console.error("Google Login error:", error);
                Swal.fire({
                    title: 'Error!',
                    text: `Google Login failed: ${error.message}`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };


    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left lg:pl-10">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Welcome back to GigConnect. Access your account to manage your tasks and bids.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" {...register("email", { required: "Email is required" })} placeholder="email@example.com" className="input input-bordered" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" {...register("password", { required: "Password is required" })} placeholder="********" className="input input-bordered" />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a> {/* Placeholder for now */}
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                        <p className="mt-4 text-center text-sm">
                            New to GigConnect? <Link to="/signup" className="link link-primary">Create an account</Link>
                        </p>
                        <div className="divider">OR</div>
                        <div className="form-control">
                            <button type="button" onClick={handleGoogleLogin} className="btn btn-outline btn-accent">
                                {/* You can add a Google Icon here later */}
                                Login with Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;