import { useApprovalActions } from "@/hooks/useApprovalActions";
import { useApprovals } from "@/hooks/useApprovals";
import { useState } from "react";
import ApprovalTableContent from "@/components/Approval/ApprovalTableContent.tsx";
import TransferModal from "@/components/Approval/TransferModal.tsx";

function ApprovalTable() {
  const { approvals, loading, error, ownerColors, refetchApprovals } =
    useApprovals();

  const {
    transferRecipientAddress,
    setTransferRecipientAddress,
    transferAmount,
    setTransferAmount,
    selectedApprovalForTransfer,
    setSelectedApprovalForTransfer,
    handleSubmitTransfer,
    handleGetBalance,
  } = useApprovalActions();

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const handleTransferClick = (approval: any) => {
    setSelectedApprovalForTransfer(approval);
    setIsTransferModalOpen(true);
  };

  const handleTransferModalOpenChange = (open: boolean) => {
    setIsTransferModalOpen(open);
    if (!open) {
      setSelectedApprovalForTransfer(null);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmitTransfer(e);
    if (success) {
      setIsTransferModalOpen(false);
      setSelectedApprovalForTransfer(null);
      refetchApprovals();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-gray-800 text-white rounded-lg shadow-md m-6">
        <p className="text-xl font-semibold animate-pulse">
          Loading approvals...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 bg-red-800 text-white rounded-lg shadow-md m-6">
        <p className="text-xl font-semibold">
          Error: {error?.message || "An unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-900 min-h-screen text-gray-100 font-sans">
      <h2 className="text-5xl font-extrabold text-blue-400 mb-10 text-center drop-shadow-lg">
        Token Approvals Dashboard
      </h2>

      <ApprovalTableContent
        approvals={approvals}
        ownerColors={ownerColors}
        onTransferClick={handleTransferClick}
        onGetBalance={handleGetBalance}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onOpenChange={handleTransferModalOpenChange}
        selectedApproval={selectedApprovalForTransfer}
        transferRecipientAddress={transferRecipientAddress}
        setTransferRecipientAddress={setTransferRecipientAddress}
        transferAmount={transferAmount}
        setTransferAmount={setTransferAmount}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

export default ApprovalTable;
