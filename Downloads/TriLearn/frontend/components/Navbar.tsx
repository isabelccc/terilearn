import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Left: Logo + Brand */}
      <div className="topnav">
        <Image src="/logo.png" alt="TriLearn Logo" width={150} height={150} />
        
      </div>

      {/* Center: Nav Links */}
      <div className="topnav flex gap-6 text-navsize font-medium text-gray-700">
        <Link href="#features" className="hover-title">Features</Link>
        <Link href="#plans" className="hover-title">Plans</Link>
        <Link href="#about" className="hover-title">About</Link>
        <Link href="/Login" className="hover-title">Login</Link>
      </div>

      {/* Right: CTA Button */}
      <div>
      <button className="primary-text">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Navbar;