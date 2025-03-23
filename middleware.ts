// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from './app/types/supabase';

// Define paths that are publicly accessible without authentication
const publicPaths = [
  '/',              // Home page
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/about',
  '/contact',
  '/pricing',
  '/terms',
  '/privacy',
  // Add any other public routes
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the pathname from the URL
  const { pathname } = req.nextUrl;
  
  // Check if the current path is in the public paths list
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // If it's not a public path and there's no session, redirect to login
  if (!isPublicPath && !session) {
    const redirectUrl = new URL('/auth/login', req.url);
    // Add the original URL as a redirectTo parameter
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Optional: If user is already logged in and tries to access auth pages,
  // redirect them to dashboard
  const isAuthPath = ['/auth/login', '/auth/register', '/auth/forgot-password'].includes(pathname);
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};