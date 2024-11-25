// frontend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const userRole = request.cookies.get('user_role');

  const publicPaths = ['/login', '/register'];
  const path = request.nextUrl.pathname;

  if (!token && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based route protection
  if (userRole) {
    const roleRoutes = {
      waiter: ['/orders', '/orders/new', '/tables'],
      kitchen: ['/kitchen'],
      admin: ['/admin', '/admin/products', '/admin/reports']
    };

    const role = userRole.value as keyof typeof roleRoutes;
    if (!roleRoutes[role]?.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};