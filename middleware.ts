import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Protect these routes
  const protectedRoutes = ['/mainpage', '/study', '/quizzes', '/flashcards'];
  const adminRoutes = ['/admin'];
  
  // Check if the path is a protected route and user isn't authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Check for admin routes
  if (adminRoutes.some(route => pathname.startsWith(route)) && 
      (!session || session.role !== 'admin')) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access login/signup pages, redirect to dashboard
  if ((pathname === '/login') && session) {
    const url = req.nextUrl.clone();
    url.pathname = '/mainpage';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/mainpage/:path*', 
    '/study/:path*', 
    '/quizzes/:path*', 
    '/flashcards/:path*', 
    '/login',
    '/admin/:path*'
  ],
}; 