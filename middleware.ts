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
  
  // Create a Supabase client specifically for use in middleware
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the pathname from the URL
  const { pathname } = req.nextUrl;
  
  // Log for debugging
  console.log(`Middleware executed: Path=${pathname}, Has Session=${!!session}`);
  
  // Check if the current path is in the public paths list
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Protected routes logic
  // If not a public path and not authenticated, redirect to login
  if (!isPublicPath && !session) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (session && (
    pathname === '/auth/login' || 
    pathname === '/auth/register' || 
    pathname === '/auth/forgot-password'
  )) {
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