import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllTasks } from '../services/taskService'; // Import the service

// Note: The mockTasksData and fetchAllTasksAPI function have been removed.

const BrowseTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    useEffect(() => {
        const loadTasks = async () => { // Renamed from getTasks
            try {
                setLoading(true);
                setError(null);
                // Fetch tasks from the backend.
                // getAllTasks is expected to return an object like:
                // { tasks: [], totalTasks: number, totalPages: number, currentPage: number }
                const responseData = await getAllTasks(); // You can pass page and limit here if you implement pagination
                const fetchedTasks = responseData.tasks || []; // Ensure fetchedTasks is an array
                setTasks(fetchedTasks);
                if (categoryFilter) {
                    setFilteredTasks(fetchedTasks.filter(task => task.category === categoryFilter));
                } else {
                    setFilteredTasks(fetchedTasks); // If no filter, show all tasks
                }
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
                setError(err.message || 'Failed to load tasks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, [categoryFilter]); // Re-run effect if categoryFilter changes

    const displayCategoryName = (slug) => {
        if (!slug) return "All Tasks";
        // Capitalize each word in the slug
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
                <h2 className="text-3xl font-bold mb-6 text-error">Error Loading Tasks</h2>
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-2 text-center">
                {displayCategoryName(categoryFilter)}
            </h2>
            {categoryFilter && (
                <p className="text-center mb-6 text-gray-500">Showing tasks for the selected category. <Link to="/browse-tasks" className="link link-primary">View all tasks</Link>.</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length > 0 ? filteredTasks.map(task => (
                    <div key={task._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                        <div className="card-body flex-grow"> {/* Added flex-grow to card-body */}
                            <h3 className="card-title text-xl lg:text-2xl">{task.title}</h3>
                            <p className="text-xs text-gray-400 mb-1">Category: <span className="font-semibold text-gray-600 capitalize">{task.category.replace('-', ' ')}</span></p>
                            <p className="text-xs text-gray-400 mb-2">Posted by: <span className="font-semibold text-gray-600">{task.creatorName}</span></p>
                            <p className="text-sm mt-1 mb-3 flex-grow">{task.description.substring(0, 100)}...</p> {/* Added flex-grow to description */}
                            <div className="flex justify-between items-center mt-auto pt-2 border-t border-base-300">
                                <div className="text-lg font-bold text-primary">${task.budget}</div>
                                <div className="text-xs text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="card-actions justify-end p-4 pt-0">
                            <Link to={`/task/${task._id}`} className="btn btn-primary btn-sm">
                                View Details
                            </Link>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
                        <p className="text-xl text-gray-500">No tasks found {categoryFilter ? `in the "${displayCategoryName(categoryFilter)}" category` : 'matching your criteria'}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseTasksPage;
