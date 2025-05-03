export const publicRoutes = ["/"];

/**
 * an array of routes that are used for authentication
 * This route is redirect login user to /settings
 * @type {string[]}
 */
export const authRoute = ["/auth/login", "/auth/register"];

/**
 * this is the prefix for api authentication route
 * Route that start with this prefix are used for API authentication process
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/settings";
