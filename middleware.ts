import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",   // wszystko pod /dashboard
    "/api/:path*",      // całe API
]);

export default clerkMiddleware(async (auth, req) => {
    const pathname = req.nextUrl.pathname;

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