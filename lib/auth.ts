import { getCookie, setCookie, deleteCookie } from "./cookies";

export const tokenStorage = {
  setTokens: (accessToken: string, refreshToken: string) => {
    setCookie("accessToken", accessToken, 7); // 7 days
    setCookie("refreshToken", refreshToken, 30); // 30 days
  },

  getAccessToken: (): string | null => {
    return getCookie("accessToken");
  },

  getRefreshToken: (): string | null => {
    return getCookie("refreshToken");
  },

  clearTokens: () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
  },
};

// User data storage
export const userStorage = {
  setUser: (user: any) => {
    setCookie("user", JSON.stringify(user), 7);
  },

  getUser: () => {
    const userCookie = getCookie("user");
    return userCookie ? JSON.parse(userCookie) : null;
  },

  clearUser: () => {
    deleteCookie("user");
  },
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!tokenStorage.getAccessToken();
};

// Logout utility
export const logout = () => {
  tokenStorage.clearTokens();
  userStorage.clearUser();
};
