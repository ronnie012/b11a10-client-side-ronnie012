import React, { useState } from 'react'; // Added useState for loading/error if needed for API call
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
// Removed Firestore imports: import { db } from '../firebase/firebase.config';
// Removed Firestore imports: import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

// Simulate an API call to the backend to add a task
const addTaskToBackendAPI = async (taskData, authToken) => {
    // In a real app, you would use fetch:
    // const response = await fetch('/api/tasks', { // Your backend endpoint
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${authToken}` // If your API requires auth
    //     },
    //     body: JSON.stringify(taskData)
    // });
    // if (!response.ok) {
    //     const errorData = await response.json().catch(() => ({ message: 'Failed to add task and parse error' }));
    //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    // }
    // return await response.json(); // Or handle success response as needed

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Simulating API call to backend with task data:', taskData);
            console.log('Simulated auth token (if needed):', authToken);
            // Simulate a successful response with a mock ID
            resolve({ id: `mock_task_${Date.now()}`, ...taskData });
        }, 1000); // Simulate 1 second network delay
    });
};


const AddTaskPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { user } = useAuth(); // Get current logged-in user
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false); // For loading state on submit button

    const onSubmit = async (data) => {
        if (!user) {
            Swal.fire("Error!", "You must be logged in to add a task.", "error");
            navigate('/login');
            return;
        }

        setIsSubmitting(true);

        const taskDataForBackend = {
            title: data.title,
            description: data.description,
            category: data.category,
            budget: parseFloat(data.budget), // Ensure budget is a number
            deadline: data.deadline, // Ensure date is in a consistent format (e.g., ISO string)
            // Backend will likely handle creatorUid, creatorEmail, status, createdAt
            // based on the authenticated user making the request.
            // However, you might send user.uid if your backend expects it explicitly.
            // creatorUid: user.uid, 
        };

        try {
            // When backend is ready, you might get the Firebase ID token for auth
            // const idToken = await user.getIdToken();
            // const createdTask = await addTaskToBackendAPI(taskDataForBackend, idToken);
            
            const createdTask = await addTaskToBackendAPI(taskDataForBackend, "mock_auth_token_if_needed");
            
            console.log("Task submitted to backend (simulated), response:", createdTask);
            Swal.fire({
                title: 'Success!',
                text: 'Task submitted successfully!', // Changed from "added" to "submitted"
                icon: 'success',
                confirmButtonText: 'OK'
            });
            reset();
            // Optionally navigate to browse tasks or my posted tasks
            // navigate('/browse-tasks'); 
        } catch (e) {
            console.error("Error submitting task to backend: ", e);
            Swal.fire({
                title: 'Error!',
                text: `Failed to submit task: ${e.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Add New Task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-base-100 p-8 rounded-lg shadow-xl">
                {/* Task Title */}
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Task Title</span></label>
                    <input type="text" {...register("title", { required: "Title is required" })} placeholder="e.g., Design a logo" className="input input-bordered w-full" disabled={isSubmitting} />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Description</span></label>
                    <textarea {...register("description", { required: "Description is required" })} placeholder="Detailed description of the task..." className="textarea textarea-bordered w-full h-32" disabled={isSubmitting}></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Category */}
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Category</span></label>
                    <select {...register("category", { required: "Category is required" })} className="select select-bordered w-full" disabled={isSubmitting}>
                        <option value="">Select Category</option>
                        <option value="web-development">Web Development</option>
                        <option value="graphic-design">Graphic Design</option>
                        <option value="writing-translation">Writing & Translation</option>
                        <option value="digital-marketing">Digital Marketing</option>
                        <option value="video-animation">Video & Animation</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>

                {/* Budget */}
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Budget ($)</span></label>
                    <input type="number" step="0.01" {...register("budget", { required: "Budget is required", valueAsNumber: true, min: { value: 0, message: "Budget cannot be negative"} })} placeholder="e.g., 150" className="input input-bordered w-full" disabled={isSubmitting} />
                    {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
                </div>

                {/* Deadline */}
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Deadline</span></label>
                    <input type="date" {...register("deadline", { required: "Deadline is required" })} className="input input-bordered w-full" disabled={isSubmitting} />
                    {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>}
                </div>

                <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                        {isSubmitting ? <span className="loading loading-spinner"></span> : "Add Task"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTaskPage;
