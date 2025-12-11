import React from 'react';
// import { Link } from 'react-router-dom'; // Link component might not be needed if services are static
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Add your newsletter submission logic here
        // For example, send the email to your backend or a third-party service
        alert(`Thank you for subscribing, ${e.target.email.value}!`);
        e.target.reset();
    };

    return (
        <footer className="footer p-10 bg-base-200 text-base-content max-w-[1220px] mx-auto rounded-xl mb-6 shadow-2xl border-2 border-base-300"> {/* Changed bg-base-300 to bg-base-200 for potentially better contrast with page content */}
            
            
            
            <form onSubmit={handleNewsletterSubmit} className="w-full md:col-span-2 lg:col-span-1"> {/* Adjusted column span for newsletter form */}
                <h6 className="footer-title">Newsletter</h6> 
                <fieldset className="form-control w-full sm:w-80"> {/* Constrained width on larger screens */}
                    <label className="label">
                    <span className="label-text">Enter your email address</span>
                    </label> 
                    <div className="join">
                        <input type="email" name="email" placeholder="username@site.com" className="input input-bordered join-item w-full" required /> 
                        <button type="submit" className="btn btn-primary join-item">Subscribe</button>
                    </div>
                </fieldset>
            </form>
            {/* New section for GigConnect info, Copyright, and Socials, spanning across footer columns on larger screens */}
            <aside className="footer-center md:col-span-full mt-8 md:mt-0 pt-8 md:pt-4 border-t border-base-300 md:border-none">
                <div className="grid md:grid-cols-3 gap-4 w-full items-center">
                    <div className="text-center md:text-left mt-8">
                        <p className="font-semibold">GigConnect</p>
                        <p className="text-sm">Connecting talent with opportunity.</p>
                    </div>
                    <p className="text-center text-sm  mt-14 ml-4">Copyright © {new Date().getFullYear()} - All right reserved</p>
                    <div className="text-blue-400 grid grid-flow-col gap-6 mt-12 justify-center md:justify-end">
                        <a href="https://www.linkedin.com/in/md-sharful-islam/" target="_blank" rel="noopener noreferrer" className="link link-hover text-2xl"><FaLinkedinIn /></a>
                        <a href="https://github.com/ronnie012" target="_blank" rel="noopener noreferrer" className="link link-hover text-2xl"><FaGithub /></a>
                        <a href="https://web.facebook.com/profile.php?id=61571101114481" target="_blank" rel="noopener noreferrer" className="link link-hover text-2xl"><FaFacebookF /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="link link-hover text-2xl"><FaTwitter /></a>
                    </div>
                </div>
            </aside>
        </footer>
    );
};
export default Footer;