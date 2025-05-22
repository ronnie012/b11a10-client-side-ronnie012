import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import an icon for categories if desired (e.g., from react-icons)
// For example: import { FaLaptopCode, FaPaintBrush, FaKeyboard, FaBullhorn, FaVideo } from 'react-icons/fa';


// Mock data for tasks - in a real app, this would come from your backend API.
// Ensure these have deadlines that can be sorted.
const allMockTasksData = [
    { _id: '1', title: 'Urgent: Design Landing Page Mockup', description: 'Need a modern mockup for a new SaaS product landing page.', category: 'graphic-design', budget: 350, deadline: '2025-06-15', creatorName: 'Alice', imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }, // Corrected URL
    { _id: '2', title: 'Quick: Write 500-word Blog Post', description: 'Topic: The Future of Remote Work. Needs to be engaging and SEO-friendly.', category: 'writing-translation', budget: 100, deadline: '2025-06-10', creatorName: 'Bob', imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
    { _id: '3', title: 'Develop Small Express.js API Endpoint', description: 'A single endpoint for user data retrieval. Specs provided.', category: 'web-development', budget: 200, deadline: '2025-07-01', creatorName: 'Charlie', imageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
    { _id: '4', title: 'Social Media Graphics Pack', description: 'Create a pack of 10 social media graphics for an upcoming campaign.', category: 'graphic-design', budget: 250, deadline: '2025-07-05', creatorName: 'Diana', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
    { _id: '5', title: 'Proofread Short Story (10 pages)', description: 'Looking for grammatical errors and flow improvements.', category: 'writing-translation', budget: 75, deadline: '2025-06-20', creatorName: 'Edward', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
    { _id: '6', title: 'Create Animated Explainer Video', description: 'A 60-second animated explainer video for a new mobile app.', category: 'video-animation', budget: 600, deadline: '2025-06-25', creatorName: 'Fiona', imageUrl: 'https://images.unsplash.com/photo-1558507652-2d9626c4e67a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
];

// Simulate fetching featured tasks (top 3 by deadline)
const fetchFeaturedTasksAPI = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const sortedTasks = [...allMockTasksData]
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)) 
                .slice(0, 3); 
            resolve(sortedTasks);
        }, 500);
    });
};

// Simulate fetching 6 most urgent tasks for the dedicated section
const fetchSixMostUrgentTasksAPI = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const sortedTasks = [...allMockTasksData]
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 6); // Get top 6
            resolve(sortedTasks);
        }, 500);
    });
};

const MOCK_CATEGORIES = [
    { name: 'Web Development', slug: 'web-development', description: 'Build and maintain websites and web apps.', icon: 'FaLaptopCode' },
    { name: 'Graphic Design', slug: 'graphic-design', description: 'Logos, branding, illustrations, and more.', icon: 'FaPaintBrush' },
    { name: 'Writing & Translation', slug: 'writing-translation', description: 'Content, copywriting, and translation services.', icon: 'FaKeyboard' },
    { name: 'Digital Marketing', slug: 'digital-marketing', description: 'SEO, social media, and advertising campaigns.', icon: 'FaBullhorn' },
    { name: 'Video & Animation', slug: 'video-animation', description: 'Editing, animation, and video production.', icon: 'FaVideo' },
    { name: 'Other', slug: 'other', description: 'Various other tasks and services.', icon: null }, // No specific icon for 'Other'
];

const MOCK_TESTIMONIALS = [
    { id: 't1', name: 'Sarah L.', role: 'Task Poster', quote: "GigConnect made it so easy to find a talented designer for my logo. The process was smooth, and I'm thrilled with the results!", avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 't2', name: 'John B.', role: 'Freelancer', quote: "I've found some great short-term projects on GigConnect. It's a fantastic platform to showcase my skills and connect with clients.", avatar: 'https://i.pravatar.cc/150?u=johnb' },
    { id: 't3', name: 'Mike P.', role: 'Task Poster', quote: "Needed urgent help with a coding task, and found a skilled developer within hours. Highly recommend GigConnect for quick turnarounds!", avatar: 'https://i.pravatar.cc/150?u=mikep' },
];



const HomePage = () => {
    const [bannerTasks, setBannerTasks] = useState([]);
    const [loadingBanner, setLoadingBanner] = useState(true);
    const [featuredSectionTasks, setFeaturedSectionTasks] = useState([]);
    const [loadingFeaturedSection, setLoadingFeaturedSection] = useState(true);

    useEffect(() => {
        const loadFeaturedTasks = async () => {
            try {
                setLoadingBanner(true);
                const tasks = await fetchFeaturedTasksAPI();
                setBannerTasks(tasks);
            } catch (error) {
                console.error("Failed to load featured tasks:", error);
            } finally {
                setLoadingBanner(false);
            }
        };
        const loadSixMostUrgent = async () => {
            try {
                setLoadingFeaturedSection(true);
                const tasks = await fetchSixMostUrgentTasksAPI();
                setFeaturedSectionTasks(tasks);
            } catch (error) {
                console.error("Failed to load six most urgent tasks:", error);
            } finally {
                setLoadingFeaturedSection(false);
            }
        };
        loadFeaturedTasks();
        loadSixMostUrgent();
    }, []);

    return (
        <>
            {/* Banner/Slider Section */}
            {loadingBanner && (
                <div className="flex justify-center items-center h-[400px] md:h-[500px] lg:h-[600px] mb-12 bg-base-200 rounded-box shadow-lg">
                    <span className="loading loading-spinner loading-lg text-primary" aria-label="Loading banner tasks"></span>
                </div>
            )}
            {!loadingBanner && bannerTasks.length > 0 && (
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0} // No space between slides
                    slidesPerView={1} // Show one slide at a time
                    navigation // Enables navigation arrows
                    pagination={{ clickable: true }} // Enables clickable pagination dots
                    loop={true} // Enables continuous loop mode
                    autoplay={{
                        delay: 4000, // Autoplay delay in ms
                        disableOnInteraction: false, // Autoplay will not be disabled after user interactions
                    }}
                    className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-box shadow-lg mb-12"
                >
                    {bannerTasks.map((task, index) => (
                        <SwiperSlide key={task._id} className="relative">
                            <img 
                                src={task.imageUrl || `https://source.unsplash.com/random/1200x600?sig=${index}&query=technology,office,work,freelance`} 
                                className="w-full h-full object-cover" 
                                alt={task.title} 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center p-4">
                                <h3 className="text-sm md:text-md font-semibold text-accent mb-2">Ending Soon! Deadline: {new Date(task.deadline).toLocaleDateString()}</h3>
                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">{task.title}</h2>
                                <p className="text-md md:text-lg text-gray-200 mb-6 max-w-xl hidden sm:block">{task.description.substring(0, 100)}...</p>
                                <div className="flex items-center space-x-4 mb-6">
                                    <span className="badge badge-lg badge-secondary">${task.budget}</span>
                                    <span className="badge badge-lg badge-info capitalize">{task.category.replace('-', ' ')}</span>
                                </div>
                                <Link to={`/task/${task._id}`} className="btn btn-primary btn-md md:btn-lg">View Task & Bid</Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
            {!loadingBanner && bannerTasks.length === 0 && (
                 <div className="text-center py-10 h-[400px] md:h-[500px] lg:h-[600px] flex flex-col justify-center items-center mb-12 bg-base-200 rounded-box shadow-lg">
                    <h2 className="text-2xl font-semibold">No featured tasks available right now.</h2>
                    <p className="text-gray-600">Check back later or browse all available tasks.</p>
                    <Link to="/browse-tasks" className="btn btn-primary mt-4">Browse All Tasks</Link>
                </div>
            )}
            
            <div className="container mx-auto px-4 py-8">
                {/* Featured Tasks Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Featured Tasks</h2>
                    {loadingFeaturedSection && (
                        <div className="flex justify-center items-center py-10">
                            <span className="loading loading-spinner loading-lg text-primary" aria-label="Loading featured tasks"></span>
                        </div>
                    )}
                    {!loadingFeaturedSection && featuredSectionTasks.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredSectionTasks.map(task => (
                                <div key={task._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                    {/* You can add an image here if tasks have one suitable for cards */}
                                    {/* <figure><img src={task.cardImageUrl || task.imageUrl} alt={task.title} className="h-48 w-full object-cover" /></figure> */}
                                    <div className="card-body">
                                        <h3 className="card-title text-xl">{task.title}</h3>
                                        <p className="text-xs text-gray-400 mb-1">Category: <span className="font-semibold text-gray-600 capitalize">{task.category.replace('-', ' ')}</span></p>
                                        <p className="text-sm mt-1 mb-3 flex-grow">{task.description.substring(0, 100)}...</p>
                                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-base-300">
                                            <div className="text-lg font-bold text-primary">${task.budget}</div>
                                            <div className="text-xs text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</div>
                                        </div>
                                        <div className="card-actions justify-end mt-3">
                                            <Link to={`/task/${task._id}`} className="btn btn-secondary btn-sm">View Details</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!loadingFeaturedSection && featuredSectionTasks.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-600">No featured tasks to display at the moment.</p>
                        </div>
                    )}
                </section>

                {/* Browse by Category Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
                    <div className="mb-8 max-w-lg mx-auto">
                        <div className="form-control">
                            <input 
                                type="text" 
                                placeholder="Search categories (e.g., Web Development)" 
                                className="input input-bordered w-full" 
                                // onChange={(e) => handleCategorySearch(e.target.value)} // Implement search logic if needed
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_CATEGORIES.map(category => (
                            <Link 
                                to={`/browse-tasks?category=${category.slug}`} // Future: Link to pre-filtered browse page
                                key={category.slug} 
                                className="card bg-base-200 hover:bg-primary hover:text-primary-content transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <div className="card-body items-center text-center">
                                    {/* Placeholder for icon - you can use react-icons here */}
                                    {/* category.icon && <category.icon className="text-4xl mb-2" /> */}
                                    <div className="text-4xl mb-2"> {/* Basic text icon placeholder */}
                                        {category.name.substring(0,1) === 'W' && '💻'}
                                        {category.name.substring(0,1) === 'G' && '🎨'}
                                        {category.name.substring(0,1) === 'D' && '📢'}
                                        {category.name.substring(0,1) === 'V' && '🎬'}
                                    </div>
                                    <h3 className="card-title text-lg md:text-xl">{category.name}</h3>
                                    <p className="text-sm opacity-70">{category.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="mb-16 py-12 bg-base-200 rounded-box shadow-md">
                    <h2 className="text-3xl font-bold mb-10 text-center">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
                        {MOCK_TESTIMONIALS.map(testimonial => (
                            <div key={testimonial.id} className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex items-center mb-4">
                                        <div className="avatar mr-4">
                                            <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                <img src={testimonial.avatar} alt={testimonial.name} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{testimonial.name}</h3>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="italic text-gray-700">"{testimonial.quote}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;
