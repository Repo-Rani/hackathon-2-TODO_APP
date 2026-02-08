import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that anyone can access WITHOUT login
  const publicRoutes = ['/signin', '/signup'];
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // If user is NOT logged in and trying to access protected route
  if (!token && !isPublicRoute) {
    // Redirect to signin page
    const signinUrl = new URL('/signin', request.url);
    return NextResponse.redirect(signinUrl);
  }

  // If user IS logged in and trying to access signin/signup
  if (token && (pathname === '/signin' || pathname === '/signup')) {
    // Redirect to homepage (/)
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  // Run on all routes EXCEPT:
  // - api routes
  // - _next/static (static files)
  // - _next/image (image optimization)
  // - favicon.ico
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};