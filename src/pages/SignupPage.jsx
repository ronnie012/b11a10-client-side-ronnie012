import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Custom hook to access AuthContext
import Swal from 'sweetalert2';

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { createUser, updateUserProfile, signInWithGoogle  } = useAuth();
    const navigate = useNavigate();

    const onSubmit = data => {
        console.log(data);
        createUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log('User created:', loggedUser);
                // Update profile
                updateUserProfile(data.name, data.photoURL)
                    .then(() => {
                        console.log('User profile updated');
                        Swal.fire({
                            title: 'Success!',
                            text: 'Account created successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        reset(); // Reset form fields
                        navigate('/'); // Navigate to home page after successful signup
                    })
                    .catch(error => {
                        console.error("Profile update error:", error);
                        // Even if profile update fails, user is created.
                        // You might want to handle this more gracefully.
                        Swal.fire({
                            title: 'Error!',
                            text: `Profile update failed: ${error.message}`,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    });
            })
            .catch(error => {
                console.error("Signup error:", error);
                Swal.fire({
                    title: 'Error!',
                    text: `Signup failed: ${error.message}`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    const handleGoogleSignUp = () => {
        signInWithGoogle()
            .then(result => {
                const loggedUser = result.user;
                console.log('User signed up with Google:', loggedUser);
                // Optionally, you might want to save user info to your backend database here
                // if you're storing user profiles beyond Firebase Auth.
                Swal.fire({
                    title: 'Success!',
                    text: 'Signed up with Google successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/'); // Navigate to home page
            })
            .catch(error => {
                console.error("Google Sign up error:", error);
                Swal.fire({
                    title: 'Error!',
                    text: `Google Sign up failed: ${error.message}`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left lg:pl-10">
                    <h1 className="text-5xl font-bold">Sign up now!</h1>
                    <p className="py-6">Join GigConnect to find tasks or offer your freelance services. Create your account to get started.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Name</span></label>
                            <input type="text" {...register("name", { required: "Name is required" })} placeholder="Your Name" className="input input-bordered" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Photo URL</span></label>
                            <input type="url" {...register("photoURL", { required: "Photo URL is required" })} placeholder="Photo URL" className="input input-bordered" />
                            {errors.photoURL && <p className="text-red-500 text-xs mt-1">{errors.photoURL.message}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" {...register("email", { required: "Email is required" })} placeholder="email@example.com" className="input input-bordered" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])/,
                                    message: "Password must include uppercase and lowercase letters"
                                }
                            })} placeholder="********" className="input input-bordered" />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Sign Up</button>
                        </div>
                        <p className="mt-4 text-center text-sm">
                            Already have an account? <Link to="/login" className="link link-primary">Login here</Link>
                        </p>
                        <div className="divider">OR</div>
                        <div className="form-control">
                            <button type="button" onClick={handleGoogleSignUp} className="btn btn-outline btn-accent">
                                {/* You can add a Google Icon here later */}
                                Sign Up with Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;


