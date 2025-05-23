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



const HomePage = () => {
    const [bannerTasks, setBannerTasks] = useState([]);
    const [loadingBanner, setLoadingBanner] = useState(true);
    const [featuredSectionTasks, setFeaturedSectionTasks] = useState([]);
    const [loadingFeaturedSection, setLoadingFeaturedSection] = useState(true); // Renamed for clarity
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [bannerError, setBannerError] = useState(null);
    const [featuredError, setFeaturedError] = useState(null);

    useEffect(() => {
        const loadBannerTasks = async () => {
            try {
                setLoadingBanner(true);
                setBannerError(null);
                const data = await getAllTasks(1, 3); // Fetch page 1, limit 3 for banner
                setBannerTasks(data.tasks);
            } catch (error) {
                console.error("Failed to load banner tasks:", error);
                setBannerError(error.message || "Could not load banner tasks.");
            } finally {
                setLoadingBanner(false);
            }
        };

        const loadFeaturedSectionData = async () => { // Renamed function for clarity
            try {
                setLoadingFeaturedSection(true);
                setFeaturedError(null);
                const data = await getAllTasks(1, 6); // Fetch page 1, limit 6 for featured section
                setFeaturedSectionTasks(data.tasks);
            } catch (error) {
                console.error("Failed to load featured section tasks:", error);
                setFeaturedError(error.message || "Could not load featured tasks.");
            } finally {
                setLoadingFeaturedSection(false);
            }
        };
        loadBannerTasks();
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
            {loadingBanner && (
                <div className="flex justify-center items-center h-[400px] md:h-[500px] lg:h-[600px] mb-12 bg-base-200 rounded-box shadow-lg">
                    <span className="loading loading-spinner loading-lg text-primary" aria-label="Loading banner tasks"></span>
                </div>
            )}
            {!loadingBanner && bannerError && (
                <div className="text-center py-10 h-[400px] md:h-[500px] lg:h-[600px] flex flex-col justify-center items-center mb-12 bg-base-200 rounded-box shadow-lg">
                    <h2 className="text-2xl font-semibold text-error">Error Loading Banner</h2>
                    <p className="text-red-500">{bannerError}</p>
                </div>
            )}
            {!loadingBanner && !bannerError && bannerTasks.length > 0 && (
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
                    className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-box shadow-lg mb-12"
                >
                    {bannerTasks.map((task, index) => (
                        <SwiperSlide key={task._id} className="relative">
                            <img
                                src={task.imageUrl || `https://placehold.co/1200x600/EFEFEF/31343C?text=Task+Image+Placeholder`}
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
            {!loadingBanner && !bannerError && bannerTasks.length === 0 && (
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
                    {loadingFeaturedSection && (
                        <div className="flex justify-center items-center py-10">
                            <span className="loading loading-spinner loading-lg text-primary" aria-label="Loading featured tasks"></span>
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
                            {featuredSectionTasks.map((task, index) => (
                                <Fade key={task._id} delay={index * 100} triggerOnce={true} duration={500}>
                                    <div className="card h-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                                        <div className="card-body flex flex-col flex-grow">
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
                                    to={`/browse-tasks?category=${category.slug}`} // Future: Link to pre-filtered browse page
                                    className="card h-full bg-base-200 hover:bg-primary hover:text-primary-content transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col"
                                >
                                    <div className="card-body items-center text-center flex flex-col flex-grow">
                                        {category.IconComponent && <category.IconComponent className="text-4xl mb-3 text-secondary" />}
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
