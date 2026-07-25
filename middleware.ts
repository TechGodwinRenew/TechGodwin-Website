import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    // Middleware executed if authorized
    return undefined;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Allow login page
        if (path === '/admin/login') return true;
        
        // Require token for all other admin routes
        if (path.startsWith('/admin')) return !!token;
        
        // Allow public routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
