import { useMemo } from "react";
import { useApprovalsList } from "@/api/approvals/useApprovalsList.ts";

const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}20`;
};

export const useApprovals = () => {
  const { data: approvals, isLoading, refetch, error } = useApprovalsList();

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
    ownerColors,
    approvals,
    loading: isLoading,
    error,
    refetchApprovals: refetch,
  };
};
