import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/superuser-login(.*)",
  "/api/auth/register(.*)",
  "/api/admin/login(.*)", // TEMP: allow admin login without auth
  "/api/admin/verify(.*)", // TEMP: allow admin verify without auth
  "/superuser-dashboard(.*)", // TEMP: allow dashboard during hardcoded auth
  "/repository(.*)",
  "/_next(.*)",
  "/favicon.ico",
  "/images(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api)(.*)",
  ],
}



