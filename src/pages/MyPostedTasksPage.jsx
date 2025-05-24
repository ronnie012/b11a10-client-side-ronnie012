import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom'; // Imported Link
import Swal from 'sweetalert2';

// Removed allMockTasksData as we will fetch from the backend

// Fetch tasks for the current user from the backend
const fetchMyTasksAPI = async (userEmail) => { // Changed parameter from authToken to userEmail
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
    if (!backendUrl) {
        throw new Error("Backend API URL is not defined in environment variables.");
    }
    // Backend expects creatorEmail as a query parameter for this "no auth" endpoint
    const response = await fetch(`${backendUrl}/api/v1/tasks/my-posted-tasks?creatorEmail=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Removed Authorization header as this endpoint relies on creatorEmail query param
        }
    });

    if (!response.ok) {
        let errorResponseMessage = `HTTP error! status: ${response.status}, URL: ${response.url}`;
        try {
            // Attempt to get the raw text of the response
            const responseText = await response.text();
            console.error("Backend raw error response for /my-posted-tasks:", responseText);
            // Try to parse it as JSON, as the backend might still send a JSON error object
            const errorData = JSON.parse(responseText);
            if (errorData && errorData.message) {
                errorResponseMessage = errorData.message;
            }
        } catch (e) {
            // If parsing fails, it means the response was not JSON or was empty.
            // The raw responseText logged above is then the most valuable piece of information.
            console.error("Failed to parse backend error response as JSON, or response was not JSON. Raw text logged above.", e);
        }
        throw new Error(errorResponseMessage);
    }
    return await response.json();
};

// Delete a task via the backend API
const deleteTaskAPI = async (taskId, authToken) => {
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
    if (!backendUrl) {
        throw new Error("Backend API URL is not defined in environment variables.");
    }
    const response = await fetch(`${backendUrl}/api/v1/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete task and parse error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Or handle success response as needed
};

const MyPostedTasksPage = () => {
    const { user } = useAuth(); 
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("MyPostedTasksPage: useEffect triggered. User object:", user ? user.uid : 'No user'); // Diagnostic

        if (user) {
            const getMyTasks = async () => {
                console.log("MyPostedTasksPage: getMyTasks called. User email:", user.email); // Diagnostic
                try {
                    setLoading(true);
                    setError(null); // Clear previous errors
                    if (!user.email) {
                        console.error("MyPostedTasksPage: User email is not available."); // Diagnostic
                        throw new Error("User email is not available to fetch tasks.");
                    }
                    // Pass user's email to the API function
                    const data = await fetchMyTasksAPI(user.email); 
                    console.log("MyPostedTasksPage: Fetched tasks data:", data); // Diagnostic
                    setMyTasks(data);
                } catch (err) {
                    console.error("Failed to fetch user's tasks:", err);
                    setError(err.message || 'Failed to load your tasks. Please try again later.');
                    setMyTasks([]); // Clear tasks on error to prevent showing stale data
                } finally {
                    setLoading(false);
                }
            };
            getMyTasks();
        } else {
            // Handle user being null (logged out or not yet loaded)
            console.log("MyPostedTasksPage: No user found, clearing tasks and setting loading to false."); // Diagnostic
            setLoading(false);
            setMyTasks([]); // Ensure tasks are cleared if user is not present
            // setError(null); // Optionally clear error if you want to show a "please login" message instead
        }
    }, [user]); 

    const handleDeleteTask = (taskId, taskTitle) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete the task: "${taskTitle}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const idToken = await user.getIdToken(); // Get Firebase ID token
                    await deleteTaskAPI(taskId, idToken);
                    
                    // Update local state to remove the task
                    setMyTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));

                    Swal.fire(
                        'Deleted!',
                        `Task "${taskTitle}" has been deleted.`,
                        'success'
                    );
                } catch (e) {
                    console.error("Error deleting task:", e);
                    Swal.fire("Error!", `Failed to delete task: ${e.message}`, "error");
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold mb-6 text-error">Error Loading Your Tasks</h2>
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    if (user && !loading && myTasks.length === 0) { // Added !loading to prevent showing this before fetch completes
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold mb-6">My Posted Tasks</h2>
                <p className="text-lg text-gray-500">You haven't posted any tasks yet.</p>
                <Link to="/add-task" className="btn btn-primary mt-4">Post a New Task</Link>
            </div>
        );
    }
    
    if (!user && !loading) { // Added !loading to prevent showing this while auth state might still be loading
         return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-lg text-gray-500">Please log in to view your tasks.</p>
                <Link to="/login" className="btn btn-primary mt-4">Login</Link>
            </div>
         )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center">My Posted Tasks</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Task Title</th>
                            <th>Category</th>
                            <th>Budget</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myTasks.map(task => (
                            <tr key={task._id} className="hover">
                                <td>
                                    <div className="font-bold">{task.title}</div>
                                    <div className="text-sm opacity-70">{task.description.substring(0,50)}...</div>
                                </td>
                                <td>{task.category}</td>
                                <td>${task.budget}</td>
                                <td>{new Date(task.deadline).toLocaleDateString()}</td>
                                <td className="space-x-1">
                                    <Link 
                                        to={`/update-task/${task._id}`} // We'll create this route and page next
                                        className="btn btn-info btn-xs"
                                    >
                                        Update
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteTask(task._id, task.title)}
                                        className="btn btn-error btn-xs"
                                    >
                                        Delete
                                    </button>
                                    <Link 
                                        to={`/task/${task._id}`} // This links to the TaskDetailPage where bids are shown
                                        className="btn btn-secondary btn-xs"
                                    >
                                        Bids
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyPostedTasksPage;
