import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",   // ALL DASHBOARD ROUTES
    "/api/:path*",      // ALL API ROUTES
]);

export default clerkMiddleware(async (auth, req) => {
    const pathname = req.nextUrl.pathname;

    // DO NOT PROTECT THE CLICK API ROUTE (/api/click)
    if (isProtectedRoute(req) && pathname !== "/api/click") {
        await auth.protect();
    }
});
export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/',
        '/(api|trpc)(.*)'
    ],
};