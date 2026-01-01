// middleware.ts
import { clerkMiddleware, createRouteMatcher,
  
} from '@clerk/nextjs/server';
import {Roles} from '@/types/globals';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Match the protected dashboard routes
const isProtectedDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

// Match the protected API routes
// const isProtectedAPIRoute = createRouteMatcher(['/api/v1(.*)']);
const isProtectedUserRoute = createRouteMatcher(['/user(.*)']);

export default clerkMiddleware(async (auth, request: NextRequest,) => {

  // Log the auth data for debugging
  const { userId ,sessionClaims} =  await auth();
  // ✅ Custom logic for /dashboard routes
  if (isProtectedDashboardRoute(request)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
    if (sessionClaims?.metadata?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    
  }

  if (isProtectedUserRoute(request)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
   

    
  }

  // // ✅ Custom logic for /api/v1 routes (block non-same-origin requests)
  // if (isProtectedAPIRoute(request)) {
  //  const secFetchSite = request.headers.get('sec-fetch-site');
  // const isDev = process.env.NODE_ENV === 'development';

  // if (!isDev && secFetchSite && secFetchSite !== 'same-origin') {
  //     return new NextResponse('Forbidden: Access is denied from external source', { status: 403 });
  //   }
  // }

  return NextResponse.next();
});

// ✅ Tell Next.js which routes to apply middleware to
export const config = {
  matcher: ['/dashboard/:path*','/user/:path*'],
};