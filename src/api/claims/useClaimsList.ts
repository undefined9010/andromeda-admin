import { useQuery } from "@tanstack/react-query";

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
  const response = await fetch(
    `${import.meta.env.VITE_BE_URL}/api/withdrawals`,
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const useClaimsList = () => {
  return useQuery({
    queryKey: ["withdrawalRequests"],
    queryFn: fetchClaimsList,
  });
};
