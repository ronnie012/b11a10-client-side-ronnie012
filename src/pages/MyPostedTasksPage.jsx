import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom'; // Imported Link

// Mock data - in a real app, this would come from my backend API
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
                                        // onClick={() => handleDelete(task._id)} // We'll implement this
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
