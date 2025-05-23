import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom'; // Renamed Link to avoid conflict, added useLocation
import useAuth from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { getTaskById } from '../services/taskService'; // submitBid removed
import { submitBid, getMyBids } from '../services/bidService'; // Import from bidService

const TaskDetailPage = () => {
    const { taskId } = useParams(); // Get taskId from URL parameters
    const { user } = useAuth(); // Get current user, might be needed for bidding logic
    const location = useLocation(); // For redirecting back after login

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userBidsCount, setUserBidsCount] = useState(0);
    const [isSubmittingBid, setIsSubmittingBid] = useState(false);

    const { register: registerBid, handleSubmit: handleBidSubmit, formState: { errors: bidErrors }, reset: resetBidForm } = useForm();


    useEffect(() => {
        const getTaskDetails = async () => {
            let token = null;
            if (user) {
                token = await user.getIdToken();
                try {
                    const myBidsData = await getMyBids(token);
                    setUserBidsCount(myBidsData.length);
                } catch (bidCountError) {
                    console.error("Failed to fetch user's bid count:", bidCountError);
                    // setUserBidsCount(0); // Or handle error appropriately
                }
            }
            try {
                setLoading(true);
                setError(null);
                const data = await getTaskById(taskId); // Use the service function
                if (data) {
                    setTask(data);
                } else {
                    setError('Task not found. It might have been deleted or the ID is incorrect.');
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
    }, [taskId, user]); // Re-run effect if taskId or user changes

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
            proposedDeadline: data.bidDeadline,
            // proposalText: data.proposalText, // Add this if you have a proposalText field in your form
            // These details will be sent to the backend, which should already expect them
            bidderEmail: user.email,
            bidderName: user.displayName || "Anonymous Bidder", // Fallback if displayName is not set
            bidderUid: user.uid,
        };

        try {
            const token = await user.getIdToken();
            // The submitBid service function now handles constructing the request
            // It expects taskId and the bidData object
            const result = await submitBid(taskId, bidData, token);
            console.log('Bid submission result:', result);

            // Re-fetch user's bids to update count accurately
            try {
                const myBidsData = await getMyBids(token);
                setUserBidsCount(myBidsData.length);
            } catch (bidCountError) {
                console.error("Failed to re-fetch user's bid count after submission:", bidCountError);
            }

            Swal.fire("Success!", result.message || "Your bid has been placed successfully!", "success");
            resetBidForm();
            // Re-fetch task details to show the new bid if the backend updates the task's bid list
            const updatedTaskData = await getTaskById(taskId);
            if (updatedTaskData) setTask(updatedTaskData);

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
            {user && (
                <div className="mb-4 p-3 bg-info text-info-content rounded-md shadow">
                    <p className="text-center font-semibold">You have bid for {userBidsCount} opportunities.</p>
                </div>
            )}
            <div className="card lg:card-side bg-base-100 shadow-xl">
                {/* Optional: Task image or category icon could go here */}
                <div className="card-body">
                    <h1 className="card-title text-3xl lg:text-4xl mb-2">{task.title}</h1>

                    <div className="mb-3 flex items-center space-x-3">
                        <span className="badge badge-accent badge-outline mr-2 capitalize">{task.category.replace('-', ' ')}</span>
                        <div className="flex items-center text-sm text-gray-500">
                            {task.creatorPhotoURL && <img src={task.creatorPhotoURL} alt={task.creatorName} className="w-6 h-6 rounded-full mr-2" />}
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
                            <p className="font-semibold">Task Deadline:</p>
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

                    {/* Section to Display Existing Bids */}
                    <div className="mt-8 border-t pt-6">
                        <h3 className="text-2xl font-semibold mb-4">Current Bids ({task.bids?.length || 0})</h3>
                        {task.bids && task.bids.length > 0 ? (
                            <div className="space-y-4">
                                {task.bids.map(bid => (
                                    <div key={bid._id} className="card card-compact bg-base-200 shadow">
                                        <div className="card-body">
                                            <div className="flex justify-between items-start">
                                                <h4 className="card-title text-lg">{bid.bidderName}</h4>
                                                <span className="text-lg font-semibold text-secondary">${bid.bidAmount}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Proposed Deadline: {new Date(bid.proposedDeadline).toLocaleDateString()} |
                                                Bid Placed: {new Date(bid.bidDate).toLocaleDateString()}
                                            </p>
                                            {bid.proposalText && <p className="text-sm mt-2">{bid.proposalText}</p>}
                                            {/* TODO: Add "Accept Bid" button for task creator */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No bids have been placed on this task yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPage;
