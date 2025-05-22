import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';

// Simulate fetching a single task by ID (similar to TaskDetailPage)
const fetchTaskByIdAPI = (taskId) => {
    // In a real app, this would come from your backend API.
    // For now, we'll use a simplified version of the mock data from TaskDetailPage.
    // Ideally, this mock data source would be centralized.
    const allMockTasksData = [
        // Match the data structure and content from HomePage.jsx for consistency
        { _id: '1', title: 'Urgent: Design Landing Page Mockup', description: 'Need a modern mockup for a new SaaS product landing page.', category: 'graphic-design', budget: 350, deadline: '2025-06-15', creatorName: 'Alice', creatorEmail: 'alice@example.com', creatorUid: 'uid-alice' },
        { _id: '2', title: 'Quick: Write 500-word Blog Post', description: 'Topic: The Future of Remote Work. Needs to be engaging and SEO-friendly.', category: 'writing-translation', budget: 100, deadline: '2025-06-10', creatorName: 'Bob', creatorEmail: 'bob@example.com', creatorUid: 'uid-bob' },
        { _id: '3', title: 'Develop Small Express.js API Endpoint', description: 'A single endpoint for user data retrieval. Specs provided.', category: 'web-development', budget: 200, deadline: '2025-07-01', creatorName: 'Charlie', creatorEmail: 'charlie@example.com', creatorUid: 'uid-charlie' },
        { _id: '4', title: 'Social Media Graphics Pack', description: 'Create a pack of 10 social media graphics for an upcoming campaign.', category: 'graphic-design', budget: 250, deadline: '2025-07-05', creatorName: 'Diana', creatorEmail: 'diana@example.com', creatorUid: 'uid-diana' },
        { _id: '5', title: 'Proofread Short Story (10 pages)', description: 'Looking for grammatical errors and flow improvements.', category: 'writing-translation', budget: 75, deadline: '2025-06-20', creatorName: 'Edward', creatorEmail: 'edward@example.com', creatorUid: 'uid-edward' },
        { _id: '6', title: 'Create Animated Explainer Video', description: 'A 60-second animated explainer video for a new mobile app.', category: 'video-animation', budget: 600, deadline: '2025-06-25', creatorName: 'Fiona', creatorEmail: 'fiona@example.com', creatorUid: 'uid-fiona' }, // Match HomePage
    ];
    return new Promise((resolve) => {
        setTimeout(() => {
            const task = allMockTasksData.find(t => t._id === taskId);
            resolve(task);
        }, 500);
    });
};

// Simulate updating a task
const updateTaskAPI = async (taskId, taskData, authToken) => {
    // In a real app, you would use fetch:
    // const response = await fetch(`/api/tasks/${taskId}`, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${authToken}`
    //     },
    //     body: JSON.stringify(taskData)
    // });
    // if (!response.ok) {
    //     const errorData = await response.json().catch(() => ({ message: 'Failed to update task and parse error' }));
    //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    // }
    // return await response.json();

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Simulating API call to update task:', { taskId, ...taskData, authToken });
            // Here you might update your mock data source if it were more sophisticated
            resolve({ _id: taskId, ...taskData });
        }, 1000);
    });
};

const UpdateTaskPage = () => {
    const { taskId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(true);
    const [task, setTask] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login'); // Should be handled by PrivateRoute, but good for safety
            return;
        }

        const loadTask = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedTask = await fetchTaskByIdAPI(taskId);
                if (fetchedTask) {
                    if (fetchedTask.creatorUid !== user.uid) {
                        Swal.fire("Error!", "You are not authorized to update this task.", "error");
                        navigate('/my-posted-tasks'); // Or to an error page
                        return;
                    }
                    setTask(fetchedTask);
                    // Pre-fill form fields
                    setValue('title', fetchedTask.title);
                    setValue('category', fetchedTask.category);
                    setValue('description', fetchedTask.description);
                    // Ensure date format for input type="date" is YYYY-MM-DD
                    const deadlineDate = new Date(fetchedTask.deadline);
                    const formattedDeadline = deadlineDate.toISOString().split('T')[0];
                    setValue('deadline', formattedDeadline);
                    setValue('budget', fetchedTask.budget);
                } else {
                    setError('Task not found.');
                    Swal.fire("Error!", "Task not found.", "error");
                    navigate('/my-posted-tasks');
                }
            } catch (err) {
                console.error("Failed to load task:", err);
                setError(err.message || 'Failed to load task details.');
                Swal.fire("Error!", `Failed to load task: ${err.message}`, "error");
            } finally {
                setLoading(false);
            }
        };

        if (taskId && user) {
            loadTask();
        }
    }, [taskId, user, setValue, navigate]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const taskDataToUpdate = {
            ...data,
            budget: parseFloat(data.budget), // Ensure budget is a number
            // creatorEmail and creatorName are not updated by the user
        };

        try {
            // const idToken = await user.getIdToken(); // For backend auth
            await updateTaskAPI(taskId, taskDataToUpdate, "mock_auth_token");
            Swal.fire("Success!", "Task updated successfully!", "success");
            reset(); // Optionally reset form
            navigate('/my-posted-tasks'); // Navigate back to the list
        } catch (e) {
            console.error("Error updating task:", e);
            Swal.fire("Error!", `Failed to update task: ${e.message}`, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
    if (!task) return <div className="container mx-auto px-4 py-8 text-center">Task could not be loaded.</div>; // Should be caught by error state

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Update Task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-base-100 p-8 rounded-lg shadow-xl">
                <div>
                    <label htmlFor="title" className="label"><span className="label-text">Task Title</span></label>
                    <input type="text" id="title" {...register("title", { required: "Task title is required" })} className="input input-bordered w-full" />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label htmlFor="category" className="label"><span className="label-text">Category</span></label>
                    <select id="category" {...register("category", { required: "Category is required" })} className="select select-bordered w-full">
                        <option value="">Select Category</option>
                        <option value="web-development">Web Development</option>
                        <option value="graphic-design">Graphic Design</option>
                        <option value="writing-translation">Writing/Translation</option>
                        <option value="digital-marketing">Digital Marketing</option>
                        <option value="video-animation">Video/Animation</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="label"><span className="label-text">Description</span></label>
                    <textarea id="description" {...register("description", { required: "Description is required" })} className="textarea textarea-bordered w-full h-32"></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="deadline" className="label"><span className="label-text">Deadline</span></label>
                        <input type="date" id="deadline" {...register("deadline", { required: "Deadline is required" })} className="input input-bordered w-full" />
                        {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="budget" className="label"><span className="label-text">Budget ($)</span></label>
                        <input type="number" id="budget" step="0.01" {...register("budget", { required: "Budget is required", valueAsNumber: true, min: { value: 0, message: "Budget must be non-negative" } })} className="input input-bordered w-full" />
                        {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="label"><span className="label-text">Your Email (Read-only)</span></label>
                    <input type="email" value={task.creatorEmail || ''} readOnly className="input input-bordered w-full input-disabled" />
                </div>

                <div>
                    <label className="label"><span className="label-text">Your Name (Read-only)</span></label>
                    <input type="text" value={task.creatorName || ''} readOnly className="input input-bordered w-full input-disabled" />
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                    {isSubmitting ? <span className="loading loading-spinner"></span> : "Update Task"}
                </button>
            </form>
        </div>
    );
};

export default UpdateTaskPage;
