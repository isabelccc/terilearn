// components/VerticalNavbar.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import
// Example placeholder icon components (replace with your real icons)
const IconHome = () => (
    <span className="material-icons-round text-2xl text-blue-600">home</span>
  );
const IconFile = () => <span className="material-icons">description</span>;
const IconMagic = () => <span className="material-icons">auto_fix_high</span>;
const IconShared = () => <span className="material-icons">group</span>;
const IconCommunity = () => <span className="material-icons">people_alt</span>;
const IconTutorials = () => <span className="material-icons">school</span>;
const IconLibrary = () => <span className="material-icons">library_books</span>;
const IconInbox = () => <span className="material-icons">mail</span>;
const IconDiscord = () => <span className="material-icons">chat</span>;
const IconUpdate = () => <span className="material-icons">update</span>;
const IconHelp = () => <span className="material-icons">help_outline</span>;

const VerticalNavbar = () => {
    const { data: session } = useSession();
     const userName = session?.user?.name || 'Guest';
    const userInitial = userName.charAt(0).toUpperCase();
    const userAvatar = session?.user?.image || userInitial; // Place a default avatar in public folder
   
 

  return (
    <nav className="flex flex-col w-72 h-screen bg-[#111111] text-white p-6">
      {/* Top: User Profile */}
      <div className="flex items-center mb-8">
        {/* Avatar Circle */}
        <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold">{userInitial}</span>
        </div>
        <span className="text-lg font-semibold">{userName}</span>
      </div>

      {/* Main Nav Items */}
      <ul className="flex flex-col space-y-3 text-sm">
        <li>
          <Link href="/home" className="flex items-center space-x-2 py-2 px-2 rounded hover:bg-[#1b1b1b]">
            <IconHome />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/files" className="flex items-center space-x-2 py-2 px-2 rounded hover:bg-[#1b1b1b]">
            <IconFile />
            <span>My files</span>
          </Link>
        </li>
        <li>
          <Link href="/generate" className="flex items-center space-x-2 py-2 px-2 rounded hover:bg-[#1b1b1b]">
            <IconMagic />
            <span>Generate</span>
          </Link>
        </li>
        <li>
          <Link href="/shared" className="flex items-center space-x-2 py-2 px-2 rounded hover:bg-[#1b1b1b]">
            <IconShared />
            <span>Shared with me</span>
          </Link>
        </li>
        <li>
          <Link href="/community" className="flex items-center space-x-2 py-2 px-2 rounded hover:bg-[#1b1b1b]">
            <IconCommunity />
            <span>Community</span>
          </Link>
        </li>
        <li>
          <Link href="/tutorials" className="flex items-center space-x-2 py-2 px-2 rounded hover:bg-[#1b1b1b]">
            <IconTutorials />
            <span>Tutorials</span>
          </Link>
        </li>
        <li>
          <Link href="/library" className="flex items-center space-x-2 py-2 px-2 rounded hover:bg-[#1b1b1b]">
            <IconLibrary />
            <span>Library</span>
          </Link>
        </li>
        <li>
          <Link href="/inbox" className="flex items-center space-x-2 py-2 px-2 rounded hover:bg-[#1b1b1b]">
            <IconInbox />
            <span>Inbox</span>
          </Link>
        </li>
      </ul>

      {/* Upgrade Box */}
      <div className="mt-8 bg-[#1b1b1b] p-4 rounded-lg text-sm">
        <p className="font-semibold mb-2">Upgrade your plan</p>
        <p className="text-gray-400 mb-4">Unlock all features on Spline</p>
        <button className="bg-purple-600 w-full py-2 rounded-md hover:bg-purple-700 transition">
          Upgrade
        </button>
      </div>

      {/* Bottom Links */}
      <ul className="mt-6 flex flex-col space-y-3 text-sm text-gray-400">
        <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-200">
          <IconDiscord />
          <span>Join our Discord</span>
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-200">
          <IconUpdate />
          <span>Updates</span>
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-200">
          <IconHelp />
          <span>Help &amp; Feedback</span>
        </li>
      </ul>
    </nav>
  );
};

export default VerticalNavbar;