import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";

interface LoginPayload {
  email: string;
  password?: string;
}

interface LoginResponse {
  user: { id: number; walletAddress: string; email?: string };
  accessToken: string;
  refreshToken: string;
}

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload) => {
      const response = await fetch(
        `${import.meta.env.VITE_BE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
