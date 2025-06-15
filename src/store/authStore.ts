import { create } from "zustand";

interface UserData {
  id: number;
  walletAddress: string;
  email?: string;
}

interface AuthState {
  user: UserData | null;
  token: string | null;
  refreshToken: string | null;
  isLoadingAuth: boolean;
  login: (userData: UserData, authToken: string, refreshToken: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isLoadingAuth: true,

  login: (userData, authToken, refreshToken) => {
    set({ user: userData, token: authToken, refreshToken: refreshToken });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  logout: () => {
    set({ user: null, token: null, refreshToken: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },

  initializeAuth: () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedUser && storedToken && storedRefreshToken) {
      try {
        set({
          user: JSON.parse(storedUser),
          token: storedToken,
          refreshToken: storedRefreshToken,
        });
      } catch (e) {
        console.error("Failed to parse stored data", e);
        get().logout();
      }
    }
    set({ isLoadingAuth: false });
  },
}));
