const VITE_API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

if (!VITE_API_BASE_URL) {
    console.error("API base URL is not configured. Please set VITE_API_BASE_URL in your .env file.");
    // Consider throwing an error or providing a more prominent alert for developers.
}

/**
 * Submits a new bid for a task.
 * @param {string} taskId - The ID of the task to bid on.
 * @param {object} bidData - The bid details (e.g., bidAmount, proposedDeadline).
 * @param {string} token - The Firebase ID token for authorization.
 * @returns {Promise<object>} The server response, typically the created bid object or a success message.
 * @throws {Error} If the API request fails.
 */
export const submitBid = async (taskId, bidData, token) => {
    const response = await fetch(`${VITE_API_BASE_URL}/tasks/${taskId}/bids`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bidData),
    });

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.dev_details || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || errorMessage;
        }
        console.error("Failed to submit bid:", errorMessage);
        throw new Error(errorMessage);
    }
    return response.json();
};

/**
 * Fetches all bids for a specific task.
 * @param {string} taskId - The ID of the task.
 * @param {string} token - The Firebase ID token for authorization.
 * @returns {Promise<Array>} A promise that resolves to an array of bids.
 * @throws {Error} If the API request fails.
 */
export const getBidsForTask = async (taskId, token) => {
    const response = await fetch(`${VITE_API_BASE_URL}/tasks/${taskId}/bids`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.dev_details || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || errorMessage;
        }
        console.error("Failed to fetch bids for task:", errorMessage);
        throw new Error(errorMessage);
    }
    return response.json(); // Expects an array of bids from the backend
};

/**
 * Fetches all bids made by the currently authenticated user.
 * @param {string} token - The Firebase ID token for authorization.
 * @returns {Promise<Array>} A promise that resolves to an array of the user's bids.
 * @throws {Error} If the API request fails.
 */
export const getMyBids = async (token) => {
    // Assuming your backend has an endpoint like /api/v1/me/bids or /api/v1/bids?bidderUid=currentUserUid
    // For this example, let's assume /api/v1/me/bids which infers user from token
    const response = await fetch(`${VITE_API_BASE_URL}/me/bids`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.dev_details || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || errorMessage;
        }
        console.error("Failed to fetch user's bids:", errorMessage);
        throw new Error(errorMessage);
    }
    return response.json(); // Expects an array of bids
};

// You can add other bid-related functions here as per your requirements, such as:
// - acceptBid(bidId, token)
// - rejectBid(bidId, token)
// - withdrawBid(bidId, token)
// - updateBid(bidId, updatedBidData, token)