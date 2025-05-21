import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

// Mock data - in a real app, this would come from your backend API
const mockTasksData = [
    { _id: '1', title: 'Design Website Mockups', description: 'Need mockups for a new e-commerce site.', category: 'graphic-design', budget: 500, deadline: '2024-08-15', creatorName: 'Alice' },
    { _id: '2', title: 'Write Blog Post', description: 'Require a 1000-word blog post on remote work tips.', category: 'writing-translation', budget: 150, deadline: '2024-08-10', creatorName: 'Bob' },
    { _id: '3', title: 'Develop REST API', description: 'Build a Node.js REST API for user management.', category: 'web-development', budget: 1200, deadline: '2024-09-01', creatorName: 'Charlie' },
    { _id: '4', title: 'Video Editing for YouTube Channel', description: 'Edit raw footage into engaging YouTube videos.', category: 'video-animation', budget: 300, deadline: '2024-08-25', creatorName: 'Diana' },
    { _id: '5', title: 'SEO Audit and Strategy', description: 'Perform an SEO audit for an existing website and provide a strategy.', category: 'digital-marketing', budget: 600, deadline: '2024-09-10', creatorName: 'Edward' },
];

// Simulate an API call
const fetchAllTasksAPI = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockTasksData);
        }, 300); // Simulate 1 second network delay
    });
};


const BrowseTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTasks = async () => {
            try {
                setLoading(true);
                setError(null);
                // When backend is ready, replace fetchAllTasksAPI() with:
                // const response = await fetch('/api/tasks'); // Your actual API endpoint
                // if (!response.ok) {
                //     throw new Error(`HTTP error! status: ${response.status}`);
                // }
                // const data = await response.json();
                // setTasks(data);
                
                const data = await fetchAllTasksAPI(); // Using simulated API call
                setTasks(data);

            } catch (err) {
                console.error("Failed to fetch tasks:", err);
                setError(err.message || 'Failed to load tasks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getTasks();
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Adjust min-height as needed */}
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold mb-6 text-error">Error Loading Tasks</h2>
                <p className="text-lg text-red-500">{error}</p>
                {/* Optionally, add a retry button */}
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold mb-6">Browse Available Tasks</h2>
                <p className="text-lg text-gray-500">No tasks available at the moment. Please check back later!</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Browse Available Tasks</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                    <div key={task._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                        <div className="card-body flex-grow">
                            <h3 className="card-title text-xl lg:text-2xl">{task.title}</h3>
                            <p className="text-xs text-gray-400 mb-1">Category: <span className="font-semibold text-gray-600">{task.category}</span></p>
                            <p className="text-xs text-gray-400 mb-2">Posted by: <span className="font-semibold text-gray-600">{task.creatorName}</span></p>
                            <p className="text-sm mt-1 mb-3 flex-grow">{task.description.substring(0, 100)}...</p>
                            <div className="flex justify-between items-center mt-auto pt-2 border-t border-base-300">
                                <div className="text-lg font-bold text-primary">${task.budget}</div>
                                <div className="text-xs text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="card-actions justify-end p-4 pt-0"> {/* Added padding for button */}
                            <Link to={`/task/${task._id}`} className="btn btn-primary btn-sm">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrowseTasksPage;
