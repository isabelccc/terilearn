import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-10 px-6 text-center">
            <div className="text-3xl font-bold mb-6">TriLearn</div>

            <div className="flex flex-wrap justify-center gap-6 text-sm font-light mb-6">
                <a href="/plans" className="hover:underline">Plans</a>
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
                <a href="/terms" className="hover:underline">Terms of Use</a>
                <a href="#" className="hover:underline">Contact Us</a>
                <a href="#" className="hover:underline">Sign up</a>
            </div>

            <div className="flex justify-center gap-6 mb-6 text-lg">
                <a href="#"><FaFacebookF className="hover:opacity-70" /></a>
                <a href="#"><FaInstagram className="hover:opacity-70" /></a>
                <a href="#"><FaTwitter className="hover:opacity-70" /></a>
                <a href="#"><FaEnvelope className="hover:opacity-70" /></a>
                <a href="#"><FaYoutube className="hover:opacity-70" /></a>
            </div>

            <button className="border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition">
                English
            </button>

            <p className="mt-6 text-sm text-gray-400">
                © TriLearn, Inc.
            </p>
        </footer>
    );
};

export default Footer;