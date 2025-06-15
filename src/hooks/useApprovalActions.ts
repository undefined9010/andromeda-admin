import { useState } from "react";
import { ethers } from "ethers";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

const tokenAddressMap: Record<string, string> = {
  USDT: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
  USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  DAI: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
};

const tokenDecimals: Record<string, number> = {
  USDT: 6,
  USDC: 6,
  DAI: 18,
};

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

export const formatTokenValue = (
  value: string,
  tokenSymbol: string,
): string => {
  const decimals = tokenDecimals[tokenSymbol];
  if (decimals !== undefined) {
    try {
      return ethers.formatUnits(value, decimals);
    } catch (error) {
      console.error(`Error formatting value for ${tokenSymbol}:`, error);
      return value;
    }
  }
  return value;
};

export const useApprovalActions = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user); // Get current authenticated user

  const [transferRecipientAddress, setTransferRecipientAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedApprovalForTransfer, setSelectedApprovalForTransfer] =
    useState<Approval | null>(null);

  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApprovalForTransfer) {
      alert("Please select an approval to transfer.");
      return false;
    }

    const { ownerAddress, tokenSymbol, spenderAddress } =
      selectedApprovalForTransfer;

    if (!user?.id) {
      alert("User not authenticated. Please log in.");
      return false;
    }
    const currentUserId = user.id;

    const tokenAddress = tokenAddressMap[tokenSymbol];
    if (!tokenAddress) {
      alert(`Unknown token symbol: ${tokenSymbol}`);
      return false;
    }

    try {
      const payload = {
        tokenAddress: tokenAddress,
        senderAddress: ownerAddress, // 'from' in transferFrom
        recipientAddress: transferRecipientAddress, // 'to' in transferFrom
        amount: transferAmount,
        tokenForwarderContractAddress: spenderAddress, // This is your TokenForwarder contract
        userId: currentUserId, // Always send the current authenticated user's ID
      };

      // Use the Axios instance for the POST request
      const response = await api.post("/transfers/transfer", payload);

      console.log("Transfer Response:", response.data); // Axios response data is in .data
      alert("Transfer initiated successfully!");

      // Invalidate the 'approvals' query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      setSelectedApprovalForTransfer(null); // Close modal/clear selected
      setTransferRecipientAddress("");
      setTransferAmount("");

      return true;
    } catch (err: any) {
      // Axios interceptors will catch HTTP errors.
      // err.response.data might contain more specific error from backend.
      console.error("Transfer Error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "An unexpected error occurred during transfer.";
      alert(`Transfer failed: ${errorMessage}`);
      return false;
    }
  };

  const handleGetBalance = async (approval: Approval) => {
    const tokenAddress = tokenAddressMap[approval.tokenSymbol];

    if (!tokenAddress) {
      alert(`Unknown token symbol: ${approval.tokenSymbol}`);
      return;
    }

    try {
      // Use the Axios instance for the GET request
      const response = await api.get(
        `/balance?walletAddress=${approval.ownerAddress}&tokenAddress=${tokenAddress}`,
      );

      const data = response.data; // Axios response data is in .data

      // Instead of setApprovals, use queryClient.setQueryData to update the cached approvals
      queryClient.setQueryData<Approval[]>(["approvals"], (oldApprovals) => {
        if (!oldApprovals) return [];
        return oldApprovals.map((item) =>
          item.id === approval.id ? { ...item, balance: data.balance } : item,
        );
      });
    } catch (error: any) {
      console.error(
        `Error fetching balance for ${approval.ownerAddress} of ${approval.tokenSymbol}:`,
        error.response?.data?.error || error.message,
      );
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred while fetching balance.";
      alert(`Error: ${errorMessage}`);
    }
  };

  return {
    transferRecipientAddress,
    setTransferRecipientAddress,
    transferAmount,
    setTransferAmount,
    selectedApprovalForTransfer,
    setSelectedApprovalForTransfer,
    handleSubmitTransfer,
    handleGetBalance,
    // tokenDecimals is already imported globally if needed, or from config/tokenConfig
  };
};
