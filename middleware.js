import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    const { pathname } = request.nextUrl;
    
    // Public routes (no authentication required)
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    
    // Check if the route is public
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }
    
    // If no token, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // For protected routes, you might want to verify token
    // For admin routes, check role
    if (pathname.startsWith('/admin')) {
        // Get user data from cookie or header
        const userStr = request.cookies.get('user')?.value;
        
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role !== 'admin') {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }
            } catch (error) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};