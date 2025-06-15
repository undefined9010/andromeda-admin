import React, { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTokenValue } from "@/hooks/useApprovalActions.ts";

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

interface TransferModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedApproval: Approval | null;
  transferRecipientAddress: string;
  setTransferRecipientAddress: (address: string) => void;
  transferAmount: string;
  setTransferAmount: (amount: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  handleGetBalance: (item: Approval) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onOpenChange,
  selectedApproval,
  transferRecipientAddress,
  setTransferRecipientAddress,
  transferAmount,
  setTransferAmount,
  handleGetBalance,
  onSubmit,
}) => {
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);

    onOpenChange(false);
  };

  useEffect(() => {
    handleGetBalance(selectedApproval as Approval);
  }, [handleGetBalance, selectedApproval]);

  if (!selectedApproval) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full min-w-[750px]  border rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Transfer Tokens
          </DialogTitle>
          <DialogDescription>
            Confirm the details below to initiate the token transfer.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 ">
          <p className="text-gray-300">
            <span className="font-semibold text-black">From:</span>{" "}
            <span className="font-mono text-sm break-words text-gray-500">
              {selectedApproval.ownerAddress}
            </span>
          </p>
          <span className="font-semibold text-gray-900">Balance:</span>{" "}
          <span className="font-semibold text-lg text-green-600">
            {Number(selectedApproval.balance ?? 0).toFixed(2) ?? 0}
          </span>{" "}
          <p className="text-gray-300">
            <span className="font-semibold text-gray-900">Token:</span>{" "}
            <span className="font-semibold text-lg text-green-600">
              {selectedApproval.tokenSymbol}
            </span>{" "}
            <span className="text-sm text-gray-800">
              {formatTokenValue(
                selectedApproval.value,
                selectedApproval.tokenSymbol,
              )}{" "}
              $
            </span>
          </p>
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="recipientAddress"
                className="block text-gray-900 text-sm font-medium mb-2 "
              >
                Recipient Address:
              </label>
              <input
                type="text"
                id="recipientAddress"
                className="flex h-10 w-full rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
                placeholder="0x..."
                value={transferRecipientAddress}
                onChange={(e) => setTransferRecipientAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="transferAmount"
                className="block text-gray-900 text-sm font-medium mb-2"
              >
                Amount:
              </label>
              <input
                type="number"
                id="transferAmount"
                className="flex h-10 w-full rounded-md border border-gray-600  px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
                placeholder="0.0"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                step="any"
                required
              />
              <span className="text-gray-400 text-xs mt-1 block">
                {selectedApproval.tokenSymbol}
              </span>
            </div>

            <DialogFooter>
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm Transfer
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferModal;
