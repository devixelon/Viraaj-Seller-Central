/**
 * Cookie utility functions for client-side cookie management
 */

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
};

/**
 * Set a cookie with optional expiration
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration (default: 7)
 */
export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === "undefined") return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const expiresString = `expires=${expires.toUTCString()}`;
  
  document.cookie = `${name}=${value};${expiresString};path=/;SameSite=Lax`;
};

/**
 * Delete a cookie by name
 * @param name - Cookie name to delete
 */
export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
};
