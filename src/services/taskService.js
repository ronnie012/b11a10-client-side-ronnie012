const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!VITE_API_BASE_URL) {
    console.error("API base URL is not configured. Please set VITE_API_BASE_URL in your .env file.");
    // You might want to throw an error here or handle it in a way that alerts the developer
}

/**
 * Fetches a single task by its ID from the backend API.
 * @param {string} taskId - The ID of the task to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the task object or null if not found.
 * @throws {Error} If the API request fails for reasons other than 404.
 */
export const getTaskById = async (taskId) => {
    const response = await fetch(`${VITE_API_BASE_URL}/tasks/${taskId}`);

    if (!response.ok) {
        if (response.status === 404) {
            console.warn(`Task with ID ${taskId} not found.`);
            return null; // Or throw a specific "TaskNotFoundError"
        }
        // For other errors, try to parse the error message from the server
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.dev_details || errorMessage;
        } catch (e) {
            // If response is not JSON, use the status text
            errorMessage = response.statusText || errorMessage;
        }
        console.error("Failed to fetch task by ID:", errorMessage);
        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data; // The backend should return the task object directly
};


/**
 * Updates an existing task on the backend API.
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} taskData - The task data to update.
 * @returns {Promise<Object>} A promise that resolves to the server's response (e.g., success message and updated task).
 * @throws {Error} If the API request fails.
 */
export const updateTask = async (taskId, taskData) => {
    const response = await fetch(`${VITE_API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // Add Authorization header if you implement JWT tokens later
            // 'Authorization': `Bearer ${your_jwt_token}`
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.dev_details || `HTTP error! status: ${response.status}`;
        console.error("Failed to update task:", errorMessage);
        throw new Error(errorMessage);
    }

    return response.json(); // Server returns { message: '...', modifiedCount: ... } or the updated task
};

/**
 * Submits a bid for a task to the backend API.
 * @param {string} taskId - The ID of the task to bid on.
 * @param {Object} bidData - The bid data (e.g., { bidAmount, proposedDeadline, proposalText, bidderEmail, bidderName, bidderUid }).
 * @returns {Promise<Object>} A promise that resolves to the server's response (e.g., success message and bid ID).
 * @throws {Error} If the API request fails.
 */
export const submitBid = async (taskId, bidData) => {
    const response = await fetch(`${VITE_API_BASE_URL}/tasks/${taskId}/bids`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add Authorization header if you implement JWT tokens later
            // 'Authorization': `Bearer ${your_jwt_token}`
        },
        body: JSON.stringify(bidData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.dev_details || `HTTP error! status: ${response.status}`;
        console.error("Failed to submit bid:", errorMessage);
        throw new Error(errorMessage);
    }

    return response.json(); // Server returns { message: '...', bidId: '...' }
};

/**
 * Fetches a paginated list of all tasks from the backend API.
 * @param {number} [page=1] - The page number to fetch.
 * @param {number} [limit=10] - The number of tasks per page.
 * @returns {Promise<Object>} A promise that resolves to an object containing { tasks: [], totalTasks: number, totalPages: number, currentPage: number }.
 * @throws {Error} If the API request fails.
 */
export const getAllTasks = async (page = 1, limit = 10) => {
    const response = await fetch(`${VITE_API_BASE_URL}/tasks?page=${page}&limit=${limit}`);

    if (!response.ok) {
        // For other errors, try to parse the error message from the server
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.dev_details || errorMessage;
        } catch (e) {
            // If response is not JSON, use the status text
            errorMessage = response.statusText || errorMessage;
        }
        console.error("Failed to fetch all tasks:", errorMessage);
        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data; // The backend returns { tasks: [], totalTasks, totalPages, currentPage }
};