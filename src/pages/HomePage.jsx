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

// Import React Awesome Reveal components
import { Fade, Slide } from "react-awesome-reveal";

import { FaLaptopCode, FaPaintBrush, FaKeyboard, FaBullhorn, FaVideo, FaPuzzlePiece } from 'react-icons/fa'; // Keep for categories
import { getAllTasks } from '../services/taskService'; // Import the service function

const MOCK_CATEGORIES = [
    { name: 'Web Development', slug: 'web-development', description: 'Build and maintain websites and web apps.', IconComponent: FaLaptopCode },
    { name: 'Graphic Design', slug: 'graphic-design', description: 'Logos, branding, illustrations, and more.', IconComponent: FaPaintBrush },
    { name: 'Writing & Translation', slug: 'writing-translation', description: 'Content, copywriting, and translation services.', IconComponent: FaKeyboard },
    { name: 'Digital Marketing', slug: 'digital-marketing', description: 'SEO, social media, and advertising campaigns.', IconComponent: FaBullhorn },
    { name: 'Video & Animation', slug: 'video-animation', description: 'Editing, animation, and video production.', IconComponent: FaVideo },
    { name: 'Other', slug: 'other', description: 'Various other tasks and services.', IconComponent: FaPuzzlePiece },
];

const MOCK_TESTIMONIALS = [
    { id: 't1', name: 'Sarah L.', role: 'Task Poster', quote: "GigConnect made it so easy to find a talented designer for my logo. The process was smooth, and I'm thrilled with the results!", avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 't2', name: 'John B.', role: 'Freelancer', quote: "I've found some great short-term projects on GigConnect. It's a fantastic platform to showcase my skills and connect with clients.", avatar: 'https://i.pravatar.cc/150?u=johnb' },
    { id: 't3', name: 'Mike P.', role: 'Task Poster', quote: "Needed urgent help with a coding task, and found a skilled developer within hours. Highly recommend GigConnect for quick turnarounds!", avatar: 'https://i.pravatar.cc/150?u=mikep' },
];

// --- Define your static banner data here ---
// Replace 'YOUR_IMG BB_BANNER_URL_X' with your actual ImgBB URLs
const STATIC_BANNER_ITEMS = [
    { _id: '68315df21e9fee0dd490283a', imageUrl: 'https://i.ibb.co/0pwJ9hYz/banner-1.jpg', title: 'Expert Web Design Solutions', description: 'Crafting beautiful, responsive websites tailored to your needs.', deadline: '2024-12-31', budget: '1500', category: 'Web Development' },
    { _id: '68315c2c26fa26e4046e330d', imageUrl: 'https://i.ibb.co/BHsBVKvG/banner-2.jpg', title: 'Creative Graphic Design Services', description: 'Logos, branding, and illustrations that captivate and engage.', deadline: '2024-11-30', budget: '500', category: 'Graphic Design' },
    { _id: '68315b2126fa26e4046e330c', imageUrl: 'https://i.ibb.co/xtZr9m2F/banner-3.jpg', title: 'Digital Marketing Mastery', description: 'Boost your online presence with our expert marketing strategies.', deadline: '2024-10-15', budget: '800', category: 'Digital Marketing' },
    { _id: '683159b126fa26e4046e330b', imageUrl: 'https://i.ibb.co/tMyQWQL7/banner-4.jpg', title: 'Engaging Video & Animation', description: 'Bring your stories to life with professional video production.', deadline: '2025-01-10', budget: '1200', category: 'Video & Animation' },
    { _id: '68315d031e9fee0dd4902839', imageUrl: 'https://i.ibb.co/v68kXp59/banner-5.jpg', title: 'Precise Writing & Translation', description: 'High-quality content and accurate translations for global reach.', deadline: '2024-12-01', budget: '300', category: 'Writing & Translation' },
    { _id: '683157d01e9fee0dd4902838', imageUrl: 'https://i.ibb.co/23GgCGsV/banner-6.jpg', title: 'Custom Software Development', description: 'Tailored software solutions to streamline your business operations.', deadline: '2025-02-28', budget: '2500', category: 'Web Development' },
    { _id: '6830ea807c32a8f8bb3b9642', imageUrl: 'https://i.ibb.co/99pZhq1F/banner-7.jpg', title: 'Innovative UI/UX Design', description: 'User-centric designs that enhance usability and satisfaction.', deadline: '2024-11-15', budget: '700', category: 'Graphic Design' },
    { _id: '68311a526b6f95025de6b360', imageUrl: 'https://i.ibb.co/zVr2NSxM/banner-8.jpg', title: 'Solve Your Unique Challenges', description: 'Find experts for any task, big or small. Post your project today!', deadline: '2024-12-20', budget: 'N/A', category: 'Other' },
];

// --- Define your static featured task data here ---
// Replace 'YOUR_IMG BB_TASK_CARD_URL_X' with your actual ImgBB URLs
const STATIC_FEATURED_TASKS = [
    { _id: '68315df21e9fee0dd490283a', imageUrl: 'https://i.ibb.co/vvqYySgS/task-1.jpg', title: 'Build a Landing Page', description: 'Need a responsive landing page for a new product launch. Figma design provided.', category: 'Web Development', budget: '300', deadline: '2025-08-05' },
    { _id: 'ftask-2', imageUrl: 'https://i.ibb.co/hFcrkRMk/task-2.jpg', title: 'Logo Design for Startup', description: 'Looking for a modern and minimalist logo for a tech startup.', category: 'Graphic Design', budget: '150', deadline: '2025-07-25' },
    { _id: 'ftask-3', imageUrl: 'https://i.ibb.co/gbmgfQ4m/task-3.jpg', title: 'Write 5 Blog Posts', description: 'Seeking a writer for 5 SEO-optimized blog posts on digital marketing trends.', category: 'Writing & Translation', budget: '250', deadline: '2025-08-10' },
    { _id: 'ftask-4', imageUrl: 'https://i.ibb.co/0Rsf21f1/task-4.jpg', title: 'Social Media Campaign Setup', description: 'Help set up and schedule a 1-month social media campaign on Instagram and Facebook.', category: 'Digital Marketing', budget: '200', deadline: '2025-07-30' },
    { _id: 'ftask-5', imageUrl: 'https://i.ibb.co/xttySkkY/task-5.jpg', title: 'Short Explainer Video Animation', description: 'Create a 30-second animated explainer video for our new app feature.', category: 'Video & Animation', budget: '400', deadline: '2025-08-20' },
    { _id: 'ftask-6', imageUrl: 'https://i.ibb.co/d4cSb47p/task-6.jpg', title: 'Data Entry & Organization', description: 'Need assistance with organizing and inputting data into a spreadsheet. Attention to detail required.', category: 'Other', budget: '100', deadline: '2025-07-28' },
    { _id: 'ftask-7', imageUrl: 'https://i.ibb.co/8n5RdGkp/task-7.jpg', title: 'Mobile App UI Mockups', description: 'Design UI mockups for 5 screens of a new mobile application. User flows will be provided.', category: 'Graphic Design', budget: '350', deadline: '2025-08-12' },
    { _id: 'ftask-8', imageUrl: 'https://i.ibb.co/1JXmS34P/task-8.jpg', title: 'Technical Documentation Review', description: 'Review and edit technical documentation for a software product for clarity and accuracy.', category: 'Writing & Translation', budget: '180', deadline: '2025-08-01' },
];


const HomePage = () => {
    // Banner tasks remain static as per previous setup.
    // Featured tasks will also be static.
    // Reverting Featured Tasks to be dynamic
    const [featuredSectionTasks, setFeaturedSectionTasks] = useState([]);
    const [loadingFeaturedSection, setLoadingFeaturedSection] = useState(true);
    const [featuredError, setFeaturedError] = useState(null);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    // No need for loading/error states for featured tasks if they are static.

    useEffect(() => {
        // Banner items are static.
        
        // Load dynamic data for Featured Tasks section
        const loadFeaturedSectionData = async () => {
            try {
                setLoadingFeaturedSection(true);
                setFeaturedError(null);
                // Fetch 6 tasks.
                // IMPORTANT: For "most recent deadlines first" and filtering out past deadlines,
                // your backend API (called by getAllTasks) needs to handle this.
                // Example call to backend: getAllTasks({ page: 1, limit: 6, sortBy: 'deadline', sortOrder: 'asc', deadlineFrom: new Date().toISOString() })
                // The current getAllTasks(1, 6) will just get 6 tasks without specific sorting/filtering by deadline from backend.
                const data = await getAllTasks(1, 6); 
                if (data && data.tasks) {
                    // Client-side filtering/sorting can be a temporary fallback if backend doesn't support it yet.
                    // However, this is NOT ideal for performance or accuracy with pagination.
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Compare date part only

                    const futureTasks = data.tasks.filter(task => new Date(task.deadline) >= today);
                    futureTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                    setFeaturedSectionTasks(futureTasks.slice(0, 6)); // Ensure only 6 are shown
                } else {
                    setFeaturedSectionTasks([]);
                }
            } catch (error) {
                console.error("Failed to load featured section tasks:", error);
                setFeaturedError(error.message || "Could not load featured tasks.");
                setFeaturedSectionTasks([]);
            } finally {
                setLoadingFeaturedSection(false);
            }
        };
        loadFeaturedSectionData();
    }, []);

    const handleCategorySearchChange = (event) => {
        setCategorySearchTerm(event.target.value);
    };

    const filteredCategories = MOCK_CATEGORIES.filter(category =>
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );


    return (
        <>
            {/* Banner/Slider Section - Not typically animated with scroll reveal as it's usually at the top */}
            {/* Display static banner items */}
            {STATIC_BANNER_ITEMS.length > 0 ? (
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    loop={true}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    className="max-w-[1220px] h-[400px] md:h-[500px] lg:h-[500px] rounded-box shadow-lg mb-8"
                >
                    {STATIC_BANNER_ITEMS.map((task) => (
                        <SwiperSlide key={task._id} className="relative">
                            <img
                                src={task.imageUrl} // Use imageUrl from static data
                                className="w-full h-full object-cover" 
                                alt={task.title}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center p-4">
                                {/* Simplified Carousel Content: Title and Subtitle (description) only */}
                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">{task.title}</h2>
                                <p className="text-md md:text-lg text-gray-200 mt-2 mb-6 max-w-xl">{task.description}</p> {/* Added mt-2 for more space below title */}
                                {/* Removed deadline, budget, category, and button from carousel display */}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="text-center py-10 h-[400px] md:h-[500px] lg:h-[600px] flex flex-col justify-center items-center mb-12 bg-base-200 rounded-box shadow-lg">
                    <h2 className="text-2xl font-semibold">No featured tasks available right now.</h2>
                    <p className="text-gray-600">Check back later or browse all available tasks.</p>
                    <Link to="/browse-tasks" className="btn btn-primary mt-4">Browse All Tasks</Link>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Featured Tasks Section */}
                <section className="mb-16">
                    <Slide direction="up" triggerOnce={true} duration={500}>
                        <h2 className="text-3xl font-bold mb-8 text-center">Featured Tasks</h2>
                    </Slide>
                    {/* Display dynamic featured tasks from MongoDB */}
                    {loadingFeaturedSection && (
                        <div className="flex justify-center items-center py-10">
                            <span className="loading loading-spinner loading-lg text-success" aria-label="Loading featured tasks"></span>
                        </div>
                    )}
                    {!loadingFeaturedSection && featuredError && (
                         <Fade triggerOnce={true}>
                            <div className="text-center py-10 text-error">
                                <p>Error loading featured tasks: {featuredError}</p>
                            </div>
                        </Fade>
                    )}
                    {!loadingFeaturedSection && !featuredError && featuredSectionTasks.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredSectionTasks.map((task, index) => ( // Mapping over dynamic data
                                <Fade key={task._id || index} delay={index * 100} triggerOnce={true} duration={500}>
                                    <div className="card h-full  bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 flex flex-col"> {/* Added transition-all, ease-in-out, hover:scale-105. Adjusted scale from 115% to 105% for subtlety */}
                                        {/* Add image to task card */}
                                        {/* Using imageUrl from STATIC_FEATURED_TASKS */}
                                        {task.imageUrl && (
                                            <figure className="h-48"> {/* Adjust height as needed */}
                                                <img 
                                                    src={task.imageUrl} // This will now come from MongoDB task data
                                                    alt={task.title} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </figure>
                                        )}
                                        <div className="card-body flex flex-col flex-grow">
                                            <h3 className="card-title text-xl">{task.title}</h3> {/* Ensured title is prominent */}
                                            <p className="text-sm text-base-content opacity-80 mb-1"> {/* Label with good contrast */}
                                                Category: <span className="font-semibold text-base-content opacity-100 capitalize">{task.category?.replace('-', ' ') || 'N/A'}</span> {/* Value with full opacity */}
                                            </p>
                                            <p className="text-base mt-1 mb-3 flex-grow text-base-content opacity-90">{task.description?.substring(0, 100) || 'No description available.'}{task.description && task.description.length > 100 ? '...' : ''}</p> {/* Larger font for description */}
                                            <div className="flex justify-between items-center mt-auto pt-2 border-t border-base-300">
                                                <div className="text-lg font-bold text-success">${task.budget}</div>
                                                <div className="text-sm text-base-content opacity-80"> {/* Label with good contrast */}
                                                    Due: <span className="font-medium text-base-content opacity-100">{new Date(task.deadline).toLocaleDateString()}</span> {/* Value with full opacity */}
                                                </div>
                                            </div>
                                            <div className="card-actions justify-end mt-3">
                                                {/* 
                                                    This button now uses the real task._id from MongoDB,
                                                    so it will correctly link to the task detail page.
                                                */}
                                                <Link to={`/task/${task._id}`} className="btn btn-primary btn-sm">See Details</Link>
                                            </div>
                                        </div>
                                    </div>
                                </Fade>
                            ))}
                        </div>
                    )}
                    {!loadingFeaturedSection && !featuredError && featuredSectionTasks.length === 0 && (
                        <Fade triggerOnce={true}>
                            <div className="text-center py-10">
                                <p className="text-gray-600">No featured tasks to display at the moment.</p>
                            </div>
                        </Fade>
                    )}
                </section>

                {/* Browse by Category Section */}
                <section className="mb-16">
                    <Slide direction="up" triggerOnce={true} duration={500}>
                        <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
                    </Slide>
                    <Fade delay={300} triggerOnce={true} duration={500}>
                        <div className="mb-8 max-w-lg mx-auto">
                            <div className="form-control">
                                <input
                                    type="text"
                                    placeholder="Search categories (e.g., Web Development)"
                                    className="input input-bordered w-full"
                                    value={categorySearchTerm}
                                    onChange={handleCategorySearchChange}
                                />
                            </div>
                        </div>
                    </Fade>
                    {filteredCategories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCategories.map((category, index) => (
                                <Fade key={category.slug} delay={index * 150 + 500} triggerOnce={true} duration={500}>
                                <Link
                                    to={`/browse-tasks?category=${category.slug}`}
                                    className="group card h-full bg-base-200 hover:bg-primary hover:text-primary-content transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-105 flex flex-col" // Added ease-in-out, hover:scale-105
                                >
                                    <div className="card-body items-center text-center flex flex-col flex-grow">
                                        {category.IconComponent && <category.IconComponent className="text-4xl mb-3 text-primary group-hover:text-primary-content" />}
                                        <h3 className="card-title text-lg md:text-xl">{category.name}</h3>
                                        <p className="text-sm opacity-70 mt-1 flex-grow">{category.description}</p>
                                    </div>
                                </Link>
                            </Fade>
                            ))}
                        </div>
                    ) : (
                        <Fade triggerOnce={true} duration={500}>
                            <div className="text-center py-10">
                                <p className="text-gray-600 text-lg">No categories found matching "{categorySearchTerm}".</p>
                            </div>
                        </Fade>
                    )}
                </section>

                {/* How It Works Section */}
                <section className="mb-16 py-12 bg-base-200 rounded-box shadow-md">
                    <Slide direction="up" triggerOnce={true} duration={500}>
                        <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
                    </Slide>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8 text-center">
                        <Fade delay={100} triggerOnce={true} duration={500}>
                            <div className="card bg-base-100 border border-base-300 shadow-lg rounded-lg p-6 hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col items-center">
                                <div className="text-5xl text-primary mb-4">1</div>
                                <h3 className="text-xl font-semibold mb-2">Post a Task</h3>
                                <p className="text-base-content opacity-80">Describe your project and what you need done. It's quick and easy!</p>
                            </div>
                        </Fade>
                        <Fade delay={200} triggerOnce={true} duration={500}>
                            <div className="card bg-base-100 border border-base-300 shadow-lg rounded-lg p-6 hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col items-center">
                                <div className="text-5xl text-primary mb-4">2</div>
                                <h3 className="text-xl font-semibold mb-2">Get Bids</h3>
                                <p className="text-base-content opacity-80">Receive competitive bids from talented freelancers ready to help.</p>
                            </div>
                        </Fade>
                        <Fade delay={300} triggerOnce={true} duration={500}>
                            <div className="card bg-base-100 border border-base-300 shadow-lg rounded-lg p-6 hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col items-center">
                                <div className="text-5xl text-primary mb-4">3</div>
                                <h3 className="text-xl font-semibold mb-2">Choose & Collaborate</h3>
                                <p className="text-base-content opacity-80">Select the best fit, assign the task, and collaborate to get it done.</p>
                            </div>
                        </Fade>
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="mb-16 py-12 bg-base-200 rounded-box shadow-md">
                    <Slide direction="up" triggerOnce={true} duration={500}>
                        <h2 className="text-3xl font-bold mb-10 text-center">What Our Users Say</h2>
                    </Slide>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
                        {MOCK_TESTIMONIALS.map((testimonial, index) => (
                            <Fade key={testimonial.id} delay={index * 100} triggerOnce={true} duration={500}>
                                <div className="card h-full bg-base-100 shadow-xl flex flex-col">
                                    <div className="card-body flex flex-col flex-grow">
                                        <div className="flex items-center mb-4">
                                            <div className="avatar mr-4">
                                                <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                    <img src={testimonial.avatar} alt={testimonial.name} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{testimonial.name}</h3>
                                                <p className="text-sm text-base-content">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        <p className="italic text-base-content flex-grow">"{testimonial.quote}"</p>
                                    </div>
                                </div>
                            </Fade>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;
