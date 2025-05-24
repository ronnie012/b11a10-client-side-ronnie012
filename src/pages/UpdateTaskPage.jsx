import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import { getTaskById, updateTask } from '../services/taskService'; // Import from our service


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
                console.log(`UpdateTaskPage: loadTask called. taskId: "${taskId}", user UID: "${user ? user.uid : 'No user'}"`);
                setLoading(true);
                setError(null);
                const fetchedTask = await getTaskById(taskId); // Use service function
                console.log("UpdateTaskPage: Fetched task data from service:", fetchedTask);

                if (fetchedTask) {
                    console.log(`UpdateTaskPage: Task found. Task creatorUid: "${fetchedTask.creatorUid}", Current user UID: "${user.uid}"`);
                    if (fetchedTask.creatorUid !== user.uid) {
                        // This check is important. If creatorUid wasn't stored with the task, or if user.uid is different, this will trigger.
                        console.warn(`UpdateTaskPage: Authorization failed. Task creatorUid ("${fetchedTask.creatorUid}") does not match current user UID ("${user.uid}").`);
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
                    console.error(`UpdateTaskPage: Task with ID "${taskId}" not found by getTaskById service. getTaskById returned:`, fetchedTask);
                    setError(`Task not found (ID: ${taskId}). It might have been deleted or the ID is incorrect.`);
                    Swal.fire("Error!", "Task not found.", "error");
                    navigate('/my-posted-tasks');
                }
            } catch (err) {
                console.error(`UpdateTaskPage: Error in loadTask for taskId "${taskId}":`, err);
                setError(err.message || 'Failed to load task details.');
                Swal.fire("Error!", `Failed to load task: ${err.message}`, "error");
            } finally {
                setLoading(false);
            }
        };

        if (taskId && user) {
            loadTask();
        }
    }, [taskId, user, navigate]); // setValue is stable and typically doesn't need to be a dependency for this effect

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const taskDataToUpdate = {
            ...data,
            budget: parseFloat(data.budget), // Ensure budget is a number
            // creatorEmail and creatorName are not updated by the user
        };

        try {
            // const idToken = await user.getIdToken(); // For backend auth
            // The updateTask service function now handles constructing the request
            const result = await updateTask(taskId, taskDataToUpdate, user); // Pass user if service needs to get token
            Swal.fire("Success!", result.message || "Task updated successfully!", "success");
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
                        {/* Aligned with AddTaskPage.jsx category values */}
                        <option value="Web Development">Web Development</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Writing & Translation">Writing & Translation</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Video & Animation">Video & Animation</option>
                        <option value="General">General</option>
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
