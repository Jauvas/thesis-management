import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/superuser-login(.*)",
  "/repository(.*)",
  "/_next(.*)",
  "/favicon.ico",
  "/images(.*)",
])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect()
})

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api)(.*)",
  ],
}


