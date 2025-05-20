import { useState } from "react";
import { ethers } from "ethers";
import { useQueryClient } from "@tanstack/react-query";

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

// Now useApprovalActions does not directly receive setApprovals.
// Instead, it gets queryClient to invalidate/update cache.
export const useApprovalActions = () => {
  const queryClient = useQueryClient(); // Initialize queryClient

  const [transferRecipientAddress, setTransferRecipientAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedApprovalForTransfer, setSelectedApprovalForTransfer] =
    useState<Approval | null>(null);

  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApprovalForTransfer) return false;

    const { ownerAddress, tokenSymbol } = selectedApprovalForTransfer;

    console.log("Initiating transfer:");
    console.log("Sender Address:", ownerAddress);
    console.log("Recipient Address:", transferRecipientAddress);
    console.log("Amount:", transferAmount);
    console.log("Token:", tokenSymbol);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BE_URL}/api/transfers/transfer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderAddress: ownerAddress,
            recipientAddress: transferRecipientAddress,
            amount: transferAmount,
            tokenSymbol: tokenSymbol,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initiate transfer");
      }

      const data = await response.json();
      console.log("Transfer Response:", data);
      alert("Transfer initiated successfully!");

      // Invalidate the 'approvals' query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      return true;
    } catch (err: any) {
      console.error("Transfer Error:", err);
      alert(`Transfer failed: ${err.message}`);
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
      const res = await fetch(
        `${import.meta.env.VITE_BE_URL}/api/balance?walletAddress=${approval.ownerAddress}&tokenAddress=${tokenAddress}`,
      );

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage || "Failed to fetch balance");
      }

      const data = await res.json();

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
        error.message,
      );
      alert(`Error: ${error.message}`);
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
    tokenDecimals,
  };
};
