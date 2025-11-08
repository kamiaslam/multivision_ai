import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/', '/landing', '/auth/signin', '/auth/signup'];

// Check if a route is public
function isPublicRoute(pathname: string): boolean {
  // Exact matches for public routes
  if (publicRoutes.includes(pathname)) {
    return true;
  }
  
  // Auth routes (signin, signup, etc.)
  if (pathname.startsWith('/auth/')) {
    return true;
  }
  
  // Share routes (public agent sharing)
  if (pathname.startsWith('/share/')) {
    return true;
  }
  
  // Static assets and API routes
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/static/') ||
      pathname.includes('.')) {
    return true;
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Check for authentication token
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // If no token and trying to access protected route, allow the request to proceed
  // The client-side ProtectedRoute component will handle authentication checks
  // This prevents server-side redirects before the client has a chance to load tokens from localStorage
  if (!token) {
    // Instead of redirecting, allow the request to proceed
    // The ProtectedRoute component will handle the redirect if needed
    return NextResponse.next();
  }
  
  // If authenticated, allow access to protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - static assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|static).*)',
  ],
};
