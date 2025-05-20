import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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

const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}20`;
};

const fetchApprovalsData = async (): Promise<Approval[]> => {
  const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/approvals`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorMessage}`,
    );
  }

  const data: Approval[] = await response.json();
  return data;
};

export const useApprovals = () => {
  const {
    data: approvals,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Approval[], Error>({
    queryKey: ["approvals"],
    queryFn: fetchApprovalsData,
    staleTime: 5 * 60 * 1000,
  });

  const ownerColors = useMemo(() => {
    const colors: Record<string, string> = {};
    if (approvals) {
      const uniqueOwners = [
        ...new Set(approvals.map((approval) => approval.ownerAddress)),
      ];
      uniqueOwners.forEach((owner) => {
        colors[owner] = getRandomColor();
      });
    }
    return colors;
  }, [approvals]);

  return {
    approvals: approvals || [],
    loading: isLoading,
    error: isError ? error : null,
    ownerColors,
    refetchApprovals: refetch,
  };
};
