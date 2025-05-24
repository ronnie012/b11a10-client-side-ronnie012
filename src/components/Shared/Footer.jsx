import React from 'react';
// import { Link } from 'react-router-dom'; // Link component might not be needed if services are static
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Add your newsletter submission logic here
        // For example, send the email to your backend or a third-party service
        alert(`Thank you for subscribing, ${e.target.email.value}!`);
        e.target.reset();
    };

    return (
        <footer className="footer p-10 bg-base-200 text-base-content"> {/* Changed bg-base-300 to bg-base-200 for potentially better contrast with page content */}
            <nav>
                <h6 className="footer-title">Services</h6> 
                {/* Making these static text instead of links */}
                <span className="cursor-default">Web Development</span>
                <span className="cursor-default">Graphic Design</span>
                <span className="cursor-default">Digital Marketing</span>
                <span className="cursor-default">Video & Animation</span>
                <span className="cursor-default">Writing & Translation</span>
            </nav> 
            <nav>
                <h6 className="footer-title">Company</h6> 
                {/* Replace # with actual links when available */}
                <span className="cursor-default">About us</span> {/* Changed to static text */}
                <span className="cursor-default">Contact</span> {/* Changed to static text */}
                <span className="cursor-default">Careers</span> {/* Placeholder */}
                <span className="cursor-default">Press kit</span> {/* Placeholder */}
            </nav> 
            <nav>
                <h6 className="footer-title">Legal</h6> 
                {/* Replace # with actual links when available */}
                <span className="cursor-default">Terms of use</span> {/* Changed to static text */}
                <span className="cursor-default">Privacy policy</span> {/* Changed to static text */}
                <span className="cursor-default">Cookie policy</span> {/* Placeholder */}
            </nav>
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
                    <div className="text-center md:text-left">
                        <p className="font-semibold">GigConnect</p>
                        <p className="text-sm">Connecting talent with opportunity.</p>
                    </div>
                    <p className="text-center text-sm">Copyright © {new Date().getFullYear()} - All right reserved</p>
                    <div className="grid grid-flow-col gap-4 justify-center md:justify-end">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="link link-hover text-2xl"><FaFacebookF /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="link link-hover text-2xl"><FaTwitter /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="link link-hover text-2xl"><FaLinkedinIn /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="link link-hover text-2xl"><FaInstagram /></a>
                    </div>
                </div>
            </aside>
        </footer>
    );
};
export default Footer;