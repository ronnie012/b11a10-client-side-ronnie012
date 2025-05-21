import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom'; // Import Link

// Mock data - in a real app, this would come from your backend API
// This represents all tasks available in the system for simulation purposes.
const allMockTasksData = [
    { _id: '1', title: 'Design Website Mockups', description: 'Need mockups for a new e-commerce site.', category: 'graphic-design', budget: 500, deadline: '2024-08-15', creatorName: 'Alice', creatorEmail: 'alice@example.com', creatorUid: 'uid-alice' },
    { _id: '2', title: 'Write Blog Post', description: 'Require a 1000-word blog post on remote work tips.', category: 'writing-translation', budget: 150, deadline: '2024-08-10', creatorName: 'Bob', creatorEmail: 'bob@example.com', creatorUid: 'uid-bob' },
    { _id: '3', title: 'Develop REST API', description: 'Build a Node.js REST API for user management.', category: 'web-development', budget: 1200, deadline: '2024-09-01', creatorName: 'Charlie', creatorEmail: 'charlie@example.com', creatorUid: 'uid-charlie' },
    { _id: '4', title: 'Social Media Campaign Setup', description: 'Setup and manage a social media campaign for a new product.', category: 'digital-marketing', budget: 750, deadline: '2024-08-20', creatorName: 'Charlie', creatorEmail: 'charlie@example.com', creatorUid: 'uid-charlie' },
    { _id: '5', title: 'Proofread Novel Manuscript', description: 'Looking for an experienced editor to proofread a 80k word novel.', category: 'writing-translation', budget: 400, deadline: '2024-09-15', creatorName: 'Alice', creatorEmail: 'alice@example.com', creatorUid: 'uid-alice' },
];

// Simulate an API call to fetch tasks for a specific user
const fetchMyTasksAPI = (currentUser) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!currentUser || !currentUser.uid) {
                resolve([]); 
                return;
            }
            const userTasks = allMockTasksData.filter(task => task.creatorUid === currentUser.uid);
            resolve(userTasks);
        }, 1000); 
    });
};


const MyPostedTasksPage = () => {
    const { user } = useAuth(); 
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            const getMyTasks = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await fetchMyTasksAPI(user); 
                    setMyTasks(data);
                } catch (err) {
                    console.error("Failed to fetch user's tasks:", err);
                    setError(err.message || 'Failed to load your tasks. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };
            getMyTasks();
        } else {
            setLoading(false);
            setMyTasks([]);
        }
    }, [user]); 

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

    if (user && myTasks.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold mb-6">My Posted Tasks</h2>
                <p className="text-lg text-gray-500">You haven't posted any tasks yet.</p>
                <Link to="/add-task" className="btn btn-primary mt-4">Post a New Task</Link>
            </div>
        );
    }
    
    if (!user) {
         return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-lg text-gray-500">Please log in to view your tasks.</p>
            </div>
         )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center">My Posted Tasks</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTasks.map(task => (
                    <div key={task._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                        <div className="card-body flex-grow">
                            <h3 className="card-title text-xl lg:text-2xl">{task.title}</h3>
                            <p className="text-xs text-gray-400 mb-1">Category: <span className="font-semibold text-gray-600">{task.category}</span></p>
                            <p className="text-sm mt-1 mb-3 flex-grow">{task.description.substring(0, 100)}...</p>
                            <div className="flex justify-between items-center mt-auto pt-2 border-t border-base-300">
                                <div className="text-lg font-bold text-primary">${task.budget}</div>
                                <div className="text-xs text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="card-actions justify-between items-center p-4 pt-0"> {/* Use justify-between for buttons */}
                            <Link to={`/task/${task._id}`} className="btn btn-primary btn-sm">
                                View Details
                            </Link>
                            {/* Placeholder for Edit/Delete buttons */}
                            {/* <button className="btn btn-sm btn-outline btn-info">Edit</button> */}
                            {/* <button className="btn btn-sm btn-outline btn-error">Delete</button> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPostedTasksPage;
