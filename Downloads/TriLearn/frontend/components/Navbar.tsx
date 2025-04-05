import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NavButton } from './NavButton';
import { useSession, signOut } from "next-auth/react";

export const Navbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <header className="flex items-center justify-between px-10 py-6 bg-white shadow-md pb-5">
      {/* Left: Logo + Brand Name */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="Logo" width={148} height={38} />
        </Link>
      </div>

      {/* Right: Nav Links */}
      <nav className="flex text-black items-center space-x-8 text-ml font-medium">
        <NavButton label="Services" />
        <NavButton label="Plans" />
        <NavButton label="Contact" />
        {isAdmin && <NavButton label="Admin Panel" href="/admin" />}
      </nav>

      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <div className="flex flex-col items-end">
              <span className="text-gray-700">
                {session.user?.email}
              </span>
              {isAdmin && (
                <span className="text-xs text-purple-600 font-medium">Admin</span>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link 
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-md transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

