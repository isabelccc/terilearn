import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

type NavButtonProps = {
  label: string;
  href?: string;
};

export const NavButton = ({ label, href }: NavButtonProps) => {
  const router = useRouter();
  const path = router.pathname;

  const isActive =
    (label.toLowerCase() === 'services' && path === '/') ||
    path === `/${label.toLowerCase()}`;

  const handleClick = () => {
    if (!isActive) {
      setTimeout(() => {
        if (label.toLowerCase() === 'services') {
          router.push('/');
        } else {
          router.push(`/${label.toLowerCase()}`);
        }
      }, 200);
    }
  };

  if (href) {
    return (
      <Link href={href} className="hover:text-gray-500 transition-colors">
        {label}
      </Link>
    );
  }
  
  return (
    <button
      className={`px-6 py-2 text-black transition duration-200 ${
        isActive
          ? 'bg-accent rounded-full shadow-md'
          : 'bg-hover-title rounded-full hover:bg-accent hover:shadow-md'
      }`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};