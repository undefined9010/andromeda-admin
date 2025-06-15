import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

interface Approval {
  id: number;
  ownerAddress: string;
  spenderAddress: string;
  tokenSymbol: string;
  value: string;
  blockNumber: number;
  transactionHash: string;
  createdAt: string;
  updatedAt: string;
  userId?: number | null;
  balance?: string;
}

const fetchApprovalsData = async (): Promise<Approval[]> => {
  const response = await api.get<Approval[]>("/approvals");
  return response.data;
};

export const useApprovalsList = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery<Approval[], Error>({
    queryKey: ["approvals"],
    queryFn: fetchApprovalsData,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};
