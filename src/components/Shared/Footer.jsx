import React from 'react';

const Footer = () => {
    return (
        <footer className="footer footer-center p-10 bg-base-300 text-base-content rounded">
            <p>Copyright © {new Date().getFullYear()} - All right reserved by GigConnect</p>
            <p>Contact | Terms & Conditions | Social Media</p>
        </footer>
    );
};

export default Footer;