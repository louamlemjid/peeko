// middleware.ts
import {
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Match dashboard & user routes
const isProtectedDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isProtectedUserRoute = createRouteMatcher(['/user(.*)']);
const isProtectedAPIRoute = createRouteMatcher(['/api/v1(.*)']);

// Exact ESP32 route
const ESP32_PEEKO_NEW_ROUTE = '/api/v1/peeko/new';
// Exact ESP32 route for PATCH
const ESP32_MESSAGE_OPEN_ROUTE = '/api/v1/message/open/';
// Base route for ESP32 GET
const ESP32_GET_PEEKO_ROUTE = '/api/v1/peeko/';
//ESP32_VERSION_LATEST
const ESP32_VERSION_LATEST = '/api/v1/version/latestVersion';

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId, sessionClaims } = await auth();
  const { pathname } = request.nextUrl;

  /* =========================
     🔐 ESP32 API KEY PROTECTION
     POST /api/v1/peeko/new
     ========================= */
  if (
    pathname === ESP32_PEEKO_NEW_ROUTE &&
    request.method === 'POST'
  ) {
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey || apiKey !== process.env.ESP32_API_KEY) {
      return new NextResponse(
        'Forbidden: Invalid ESP32 API key',
        { status: 403 }
      );
    }

    // Valid ESP32 request → continue
    return NextResponse.next();
  }
	
	/* =========================
     🔐 ESP32 API KEY PROTECTION
     GET /api/v1/version/latestVersion
     ========================= */
  if (
    pathname === ESP32_VERSION_LATEST &&
    request.method === 'GET'
  ) {
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey || apiKey !== process.env.ESP32_API_KEY) {
      return new NextResponse(
        'Forbidden: Invalid ESP32 API key',
        { status: 403 }
      );
    }

    // Valid ESP32 request → continue
    return NextResponse.next();
  }
  /* =========================
     🔐 ESP32 API KEY PROTECTION
     PATCH /api/v1/message/open/[userCode]
     ========================= */
  if (
    pathname.startsWith(ESP32_MESSAGE_OPEN_ROUTE) &&
    request.method === 'PATCH'
  ) {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.ESP32_API_KEY) {
      return new NextResponse(
        'Forbidden: Invalid ESP32 API key',
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // ------------------------------
  // 🔐 ESP32 GET /api/v1/peeko/[peekoCode]
  // ------------------------------
  if (
    pathname.startsWith(ESP32_GET_PEEKO_ROUTE) &&
    request.method === 'GET'
  ) {
    // Ensure this is NOT one of the internal PATCH routes
    const isInternalPatch =
      pathname.startsWith('/api/v1/peeko/mood/') ||
      pathname.startsWith('/api/v1/peeko/name/') ||
      pathname.startsWith('/api/v1/peeko/pickAnimationSet/');

    if (!isInternalPatch) {
      const apiKey = request.headers.get('x-api-key');
      if (!apiKey || apiKey !== process.env.ESP32_API_KEY) {
        return new NextResponse(
          'Forbidden: Invalid ESP32 API key',
          { status: 403 }
        );
      }
      return NextResponse.next();
    }
  }

  if (isProtectedAPIRoute(request)) {
   const secFetchSite = request.headers.get('sec-fetch-site');
  const isDev = process.env.NODE_ENV === 'development';

  if ( secFetchSite !== 'same-origin') {
      return new NextResponse('Forbidden: Access is denied from external source', { status: 403 });
    }
  }

  /* =========================
     🧠 DASHBOARD (ADMIN)
     ========================= */
  if (isProtectedDashboardRoute(request)) {
    if (!userId) {
      return NextResponse.redirect(
        new URL('/auth/sign-in', request.url)
      );
    }

    if (sessionClaims?.metadata?.role !== 'admin') {
      return NextResponse.redirect(
        new URL('/', request.url)
      );
    }
  }

  /* =========================
     👤 USER ROUTES
     ========================= */
  if (isProtectedUserRoute(request)) {
    if (!userId) {
      return NextResponse.redirect(
        new URL('/auth/sign-in', request.url)
      );
    }
  }

  return NextResponse.next();
});

/* =========================
   📌 Middleware matcher
   ========================= */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/user/:path*',
    '/api/v1/peeko/new',
    '/api/v1/version/latestVersion/',
    '/api/v1/message/open/:path*',
    '/api/v1/peeko/:path*',
    '/api/v1/:path*',
  ],
};
