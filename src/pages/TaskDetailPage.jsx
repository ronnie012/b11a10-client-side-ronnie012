import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom'; // Renamed Link to avoid conflict
import useAuth from '../hooks/useAuth'; // May be needed for bidding or other actions
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

// Simulate fetching a single task by ID (replace with actual API call later)
const fetchTaskByIdAPI = (taskId) => {
    // Mock data - in a real app, this would come from your backend API
    const allMockTasksData = [
        { _id: '1', title: 'Design Website Mockups', description: 'Need mockups for a new e-commerce site. This involves creating 5 pages: Homepage, Product Listing, Product Detail, Cart, and Checkout. Brand guidelines will be provided. Looking for a modern and clean design.', category: 'graphic-design', budget: 500, deadline: '2024-08-15', creatorName: 'Alice', creatorEmail: 'alice@example.com', creatorUid: 'uid-alice', creatorPhotoURL: 'https://i.pravatar.cc/150?u=alice@example.com' },
        { _id: '2', title: 'Write Blog Post', description: 'Require a 1000-word blog post on remote work tips. The article should be well-researched, engaging, and SEO-friendly. Target audience is young professionals.', category: 'writing-translation', budget: 150, deadline: '2024-08-10', creatorName: 'Bob', creatorEmail: 'bob@example.com', creatorUid: 'uid-bob', creatorPhotoURL: 'https://i.pravatar.cc/150?u=bob@example.com' },
        { _id: '3', title: 'Develop REST API', description: 'Build a Node.js REST API for user management. Endpoints should include CRUD operations for users, authentication, and authorization. Experience with Express.js and MongoDB preferred.', category: 'web-development', budget: 1200, deadline: '2024-09-01', creatorName: 'Charlie', creatorEmail: 'charlie@example.com', creatorUid: 'uid-charlie', creatorPhotoURL: 'https://i.pravatar.cc/150?u=charlie@example.com' },
        { _id: '4', title: 'Video Editing for YouTube Channel', description: 'Edit raw footage (approx 30 mins) into 3-5 engaging YouTube videos (5-7 mins each). Includes color correction, adding graphics, and sound mixing.', category: 'video-animation', budget: 300, deadline: '2024-08-25', creatorName: 'Diana', creatorEmail: 'diana@example.com', creatorUid: 'uid-diana', creatorPhotoURL: 'https://i.pravatar.cc/150?u=diana@example.com' },
        { _id: '5', title: 'SEO Audit and Strategy', description: 'Perform an SEO audit for an existing e-commerce website and provide a comprehensive strategy document for improvement. Focus on on-page, off-page, and technical SEO.', category: 'digital-marketing', budget: 600, deadline: '2024-09-10', creatorName: 'Edward', creatorEmail: 'edward@example.com', creatorUid: 'uid-edward', creatorPhotoURL: 'https://i.pravatar.cc/150?u=edward@example.com' },
    ];
    return new Promise((resolve) => {
        setTimeout(() => {
            const task = allMockTasksData.find(t => t._id === taskId);
            resolve(task); // Resolve with the task or undefined if not found
        }, 500); // Simulate network delay
    });
};

// Simulate submitting a bid to the backend
const submitBidToBackendAPI = async (bidData, taskId, bidderInfo, authToken) => {
    // In a real app, you would use fetch:
    // const response = await fetch(`/api/tasks/${taskId}/bids`, { // Your backend endpoint
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${authToken}` // If your API requires auth
    //     },
    //     body: JSON.stringify({ ...bidData, bidderUid: bidderInfo.uid, bidderEmail: bidderInfo.email })
    // });
    // if (!response.ok) {
    //     const errorData = await response.json().catch(() => ({ message: 'Failed to submit bid and parse error' }));
    //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    // }
    // return await response.json();

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Simulating API call to submit bid:', { taskId, ...bidData, bidderInfo, authToken });
            resolve({ bidId: `mock_bid_${Date.now()}`, ...bidData });
        }, 1000);
    });
};

const TaskDetailPage = () => {
    const { taskId } = useParams(); // Get taskId from URL parameters
    const { user } = useAuth(); // Get current user, might be needed for bidding logic

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmittingBid, setIsSubmittingBid] = useState(false);

    const { register: registerBid, handleSubmit: handleBidSubmit, formState: { errors: bidErrors }, reset: resetBidForm } = useForm();


    useEffect(() => {
        const getTaskDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                // When backend is ready, replace fetchTaskByIdAPI(taskId) with:
                // const response = await fetch(`/api/tasks/${taskId}`); // Your actual API endpoint
                // if (!response.ok) {
                //     if (response.status === 404) throw new Error('Task not found');
                //     throw new Error(`HTTP error! status: ${response.status}`);
                // }
                // const data = await response.json();
                // setTask(data);

                const data = await fetchTaskByIdAPI(taskId);
                if (data) {
                    setTask(data);
                } else {
                    setError('Task not found.');
                }

            } catch (err) {
                console.error("Failed to fetch task details:", err);
                setError(err.message || 'Failed to load task details.');
            } finally {
                setLoading(false);
            }
        };

        if (taskId) {
            getTaskDetails();
        } else {
            setError("Task ID is missing."); // Should not happen with proper routing
            setLoading(false);
        }
    }, [taskId]); // Re-run effect if taskId changes

    const onBidSubmit = async (data) => {
        if (!user) {
            Swal.fire("Error!", "You must be logged in to place a bid.", "error");
            // Consider navigating to login or just showing the message
            return;
        }
        if (user.uid === task?.creatorUid) {
            Swal.fire("Error!", "You cannot bid on your own task.", "error");
            return;
        }

        setIsSubmittingBid(true);
        const bidData = {
            bidAmount: parseFloat(data.bidAmount),
            deadline: data.bidDeadline, // Assuming this is the bidder's proposed deadline
            // proposalText: data.proposalText, // If you add a proposal text field
        };

        try {
            // const idToken = await user.getIdToken(); // For backend auth
            // await submitBidToBackendAPI(bidData, taskId, { uid: user.uid, email: user.email }, idToken);
            await submitBidToBackendAPI(bidData, taskId, { uid: user.uid, email: user.email, name: user.displayName }, "mock_auth_token");

            Swal.fire("Success!", "Your bid has been placed successfully!", "success");
            resetBidForm();
            // TODO: Potentially refresh bids list or update UI
        } catch (e) {
            console.error("Error submitting bid:", e);
            Swal.fire({
                title: 'Error!',
                text: `Failed to place bid: ${e.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmittingBid(false);
        }
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
                <h2 className="text-3xl font-bold mb-6 text-error">Error</h2>
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    if (!task) {
        // This case might be redundant if error state for "Task not found" is handled above
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-lg text-gray-500">Task details could not be loaded.</p>
            </div>
        );
    }

    // Basic UI for task details
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="card lg:card-side bg-base-100 shadow-xl">
                {/* Optional: Task image or category icon could go here */}
                <div className="card-body">
                    <h1 className="card-title text-3xl lg:text-4xl mb-2">{task.title}</h1>
                    
                    <div className="mb-3 flex items-center space-x-3">
                        <span className="badge badge-accent badge-outline mr-2">{task.category}</span>
                        <div className="flex items-center text-sm text-gray-500">
                            {task.creatorPhotoURL && <img src={task.creatorPhotoURL} alt={task.creatorName} className="w-6 h-6 rounded-full mr-2"/>}
                            <span>Posted by: {task.creatorName}</span>
                        </div>
                    </div>

                    <div className="divider my-1"></div>

                    <p className="mb-2"><strong className="font-semibold">Description:</strong></p>
                    <p className="mb-4 whitespace-pre-line">{task.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="font-semibold">Budget:</p>
                            <p className="text-xl text-primary">${task.budget}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Deadline:</p>
                            <p>{new Date(task.deadline).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Placeholder for Bidding Section */}
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-2xl font-semibold mb-4">Place Your Bid</h3>
                        {!user ? (
                            <p className="text-gray-600">Please <RouterLink to="/login" state={{ from: location }} className="link link-primary">login</RouterLink> to place a bid.</p>
                        ) : user.uid === task.creatorUid ? (
                            <p className="text-gray-600">You cannot bid on your own task.</p>
                        ) : (
                            <form onSubmit={handleBidSubmit(onBidSubmit)} className="space-y-4">
                                <div>
                                    <label htmlFor="bidAmount" className="label"><span className="label-text">Your Bid Amount ($)</span></label>
                                    <input
                                        type="number"
                                        id="bidAmount"
                                        step="0.01"
                                        {...registerBid("bidAmount", { required: "Bid amount is required", valueAsNumber: true, min: { value: 0.01, message: "Bid must be positive" } })}
                                        className="input input-bordered w-full max-w-xs"
                                        disabled={isSubmittingBid}
                                    />
                                    {bidErrors.bidAmount && <p className="text-red-500 text-xs mt-1">{bidErrors.bidAmount.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="bidDeadline" className="label"><span className="label-text">Your Proposed Deadline</span></label>
                                    <input
                                        type="date"
                                        id="bidDeadline"
                                        {...registerBid("bidDeadline", { required: "Proposed deadline is required" })}
                                        className="input input-bordered w-full max-w-xs"
                                        disabled={isSubmittingBid}
                                    />
                                    {bidErrors.bidDeadline && <p className="text-red-500 text-xs mt-1">{bidErrors.bidDeadline.message}</p>}
                                </div>
                                {/* TODO: Add a textarea for proposal/cover letter if needed */}
                                <button type="submit" className="btn btn-primary" disabled={isSubmittingBid}>
                                    {isSubmittingBid ? <span className="loading loading-spinner"></span> : "Place Bid"}
                                </button>
                            </form>
                        )}
                    </div>

                     {/* Placeholder for Existing Bids Section (if applicable) */}
                     {/* <div className="mt-8 border-t pt-6">
                        <h3 className="text-2xl font-semibold mb-4">Current Bids</h3>
                        <p className="text-gray-700">List of bids will go here...</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPage;
