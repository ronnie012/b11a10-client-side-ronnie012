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
    const [hasUserBidOnThisTask, setHasUserBidOnThisTask] = useState(false);

    const { register: registerBid, handleSubmit: handleBidSubmit, formState: { errors: bidErrors }, reset: resetBidForm } = useForm();


    useEffect(() => {
        const getTaskDetails = async () => {
            setLoading(true);
            setError(null);
            setHasUserBidOnThisTask(false); // Reset for the current task

            let token = null;
            if (user) {
                token = await user.getIdToken();
                try {
                    if (!user.email) {
                        throw new Error("User email is not available to fetch bids.");
                    }
                    const myBidsData = await getMyBids(token, user.email);
                    setUserBidsCount(myBidsData.length);
                } catch (bidCountError) {
                    console.error("Failed to fetch user's bid count:", bidCountError);
                    setUserBidsCount(0); // Reset or set to a state indicating an error
                }
            } else {
                setUserBidsCount(0); // Reset bid count if user logs out
            }
            try {
                const data = await getTaskById(taskId); // Use the service function
                console.log('[useEffect] Raw data from getTaskById:', JSON.parse(JSON.stringify(data))); // Log a deep copy
                if (data) {
                    setTask(data);
                    // Check if the current user has already bid on this task
                    console.log('[useEffect] Checking bids for user.uid:', user?.uid, 'in data.bids:', data.bids);
                    if (user && user.uid) {
                        // Log the bidderUid of the first bid for comparison, if bids exist
                        if (data.bids && data.bids.length > 0) {
                            console.log('[useEffect] First bid object in data.bids:', JSON.parse(JSON.stringify(data.bids[0])));
                        }
                        const userHasBid = data.bids?.some(bid => bid.bidderUid === user.uid);
                        console.log(`[useEffect] User ${user.uid} has bid on this task (some check): ${userHasBid}`);
                        if (userHasBid) {
                            setHasUserBidOnThisTask(true);
                        } else {
                            setHasUserBidOnThisTask(false);
                        }
                    } else {
                        console.log('[useEffect] User or user.uid not available for bid check, setting hasUserBidOnThisTask to false.');
                        setHasUserBidOnThisTask(false); // User not logged in or uid not ready
                    }
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
        if (hasUserBidOnThisTask) {
            Swal.fire("Info!", "You have already placed a bid on this task.", "info");
            return;
        }

        setIsSubmittingBid(true);
        const bidData = {
            biddingAmount: parseFloat(data.bidAmount), // Changed key to biddingAmount
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

            // Optimistically update the bid count on the UI for immediate feedback
            setUserBidsCount(prevCount => prevCount + 1);

            // Then, attempt to re-fetch the accurate count from the server for synchronization
            try {
                if (!user.email) {
                    throw new Error("User email is not available to re-sync bid count.");
                }
                const myBidsData = await getMyBids(token, user.email);
                setUserBidsCount(myBidsData.length); // Sync with actual server count
            } catch (bidCountError) {
                console.error("Failed to re-sync user's bid count after submission:", bidCountError);
                // If sync fails, the count remains optimistically updated.
                // You might consider more complex error handling or reverting the optimistic update
                // if strict accuracy immediately after sync failure is critical.
            }

            Swal.fire("Success!", result.message || "Your bid has been placed successfully!", "success");
            resetBidForm();
            // Re-fetch task details to show the new bid if the backend updates the task's bid list
            console.log('[onBidSubmit] Re-fetching task details after bid...');
            const updatedTaskData = await getTaskById(taskId);
            console.log('[onBidSubmit] Updated task data from getTaskById:', JSON.parse(JSON.stringify(updatedTaskData))); // Log a deep copy
            if (updatedTaskData) setTask(updatedTaskData);
            setHasUserBidOnThisTask(true); // Mark that user has now bid on this task

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
                <div className="mb-4 p-3 bg-primary text-primary-content rounded-md shadow">
                    <p className="text-center font-semibold">You have bid for {userBidsCount} opportunities.</p>
                </div>
            )}
            <div className="card lg:card-side bg-base-200 shadow-xl">
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
                            <p className="text-xl text-base-content">${task.budget}</p>
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
                        ) : hasUserBidOnThisTask ? (
                            <p className="text-success">You have already placed a bid on this task.</p>
                        ) :  (
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
                                            {/* Bidder Info - Assuming bidderName is now stored with the bid */}
                                            {/* TODO: Future enhancement - fetch avatar if not stored with bid */}
                                            <div className="flex items-center mb-2">
                                                {/* Placeholder for avatar if you add it later */}
                                                {/* <img src={bid.bidderPhotoURL || 'default-avatar.png'} alt={bid.bidderName || 'Bidder'} className="w-8 h-8 rounded-full mr-2" /> */}
                                                <h4 className="card-title text-lg">{bid.bidderName || bid.bidderEmail || 'Anonymous Bidder'}</h4>
                                            </div>

                                            <div className="flex items-baseline"> {/* Changed from justify-between and items-start */}
                                                <p className="text-sm mr-2">Proposed Bid:</p> {/* Added margin for spacing */}
                                                <span className="text-lg font-semibold text-secondary">
                                                    ${typeof bid.biddingAmount === 'number' ? bid.biddingAmount.toFixed(2) : 'N/A'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Proposed Deadline: {bid.bidderDeadline ? new Date(bid.bidderDeadline).toLocaleDateString() : 'Not specified'} |
                                                Bid Placed: {bid.bidPlacedAt ? new Date(bid.bidPlacedAt).toLocaleDateString() : 'Unknown'}
                                            </p>
                                            {bid.comment && <p className="text-sm mt-2">Comment: {bid.comment}</p>}
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
