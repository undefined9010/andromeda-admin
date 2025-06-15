import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export interface ClaimRequest {
  id?: number;
  ownerAddress: string;
  profit: string;
  amount: string;
  tokenName: string;
  durationWeeks: number;
  investmentId: number;
  unlockDate: string;
  createdAt?: string;
  updatedAt?: string;
}

const fetchClaimsList = async (): Promise<ClaimRequest[]> => {
  const response = await api.get<ClaimRequest[]>("/withdrawals");
  return response.data;
};

export const useClaimsList = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery<ClaimRequest[], Error>({
    queryKey: ["withdrawalRequests"],
    queryFn: fetchClaimsList,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};
