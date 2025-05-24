const VITE_API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

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
    console.log(`taskService.js: getTaskById called for taskId: ${taskId}`);
    const response = await fetch(`${VITE_API_BASE_URL}/api/v1/tasks/${taskId}`);

    // Log raw response details
    console.log(`taskService.js: getTaskById - Response for ${taskId} - Status: ${response.status}, OK: ${response.ok}`);

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
 * @param {Object} user - The Firebase user object from useAuth, used for getting the ID token.
 * @returns {Promise<Object>} A promise that resolves to the server's response (e.g., success message and updated task).
 * @throws {Error} If the API request fails.
 */
export const updateTask = async (taskId, taskData, user) => {
    if (!user) {
        const authError = "User not authenticated. Cannot update task.";
        console.error(authError);
        throw new Error(authError);
    }

    let token;
    try {
        token = await user.getIdToken();
    } catch (tokenError) {
        console.error("Failed to get Firebase ID token:", tokenError);
        throw new Error("Authentication error: Could not retrieve user token.");
    }

    const response = await fetch(`${VITE_API_BASE_URL}/api/v1/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        // Consistent error parsing like in other functions
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.dev_details || errorMessage;
        } catch (e) {
            // If response is not JSON, use the status text
            errorMessage = response.statusText || errorMessage;
        }
        console.error("Failed to update task:", errorMessage);
        throw new Error(errorMessage);
    }

    return response.json(); // Server returns { message: '...', modifiedCount: ... } or the updated task
};
/**
 * Fetches a paginated list of all tasks from the backend API.
 * @param {number} [page=1] - The page number to fetch.
 * @param {number} [limit=10] - The number of tasks per page.
 * @returns {Promise<Object>} A promise that resolves to an object containing { tasks: [], totalTasks: number, totalPages: number, currentPage: number }.
 * @throws {Error} If the API request fails.
 */
export const getAllTasks = async (page = 1, limit = 10) => {
    const response = await fetch(`${VITE_API_BASE_URL}/api/v1/tasks?page=${page}&limit=${limit}`);

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