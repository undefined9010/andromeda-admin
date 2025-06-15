import React, { useEffect, useState } from "react";
import { ClaimRequest, useClaimsList } from "@/api/claims/useClaimsList.ts";
import { useDeleteClaimRequest } from "@/api/claims/useDeleteClaim";
import { useDeleteInvestment } from "@/api/investments/useDeleteInvestment.ts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 128 + 128)
    .toString(16)
    .padStart(2, "0");
  const g = Math.floor(Math.random() * 128 + 128)
    .toString(16)
    .padStart(2, "0");
  const b = Math.floor(Math.random() * 128 + 128)
    .toString(16)
    .padStart(2, "0");
  return `#${r}${g}${b}20`;
};

const ClaimRequestsList: React.FC = () => {
  const { data: claimRequests, isLoading, isError, error } = useClaimsList();
  const [ownerColors, setOwnerColors] = useState<Record<string, string>>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ClaimRequest | null>(
    null,
  );

  useEffect(() => {
    if (claimRequests) {
      const uniqueOwners = [
        ...new Set(claimRequests.map((request) => request.ownerAddress)),
      ];
      const colors: Record<string, string> = {};
      uniqueOwners.forEach((owner) => {
        colors[owner] = getRandomColor();
      });
      setOwnerColors(colors);
    }
  }, [claimRequests]);

  const { mutate: deleteClaimRequest, isPending: isDeletingClaim } =
    useDeleteClaimRequest();
  const { mutate: deleteInvestment, isPending: isDeletingInvestment } =
    useDeleteInvestment();

  const handleCompleteClick = (request: ClaimRequest) => {
    setSelectedRequest(request);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmComplete = () => {
    if (!selectedRequest) return;

    const claimId = Number(selectedRequest.id);
    const investmentId = Number(selectedRequest.investmentId);

    if (isNaN(claimId) || isNaN(investmentId)) {
      console.error("Invalid ID for deletion");
      return;
    }

    deleteClaimRequest(claimId, {
      onSuccess: () => {
        deleteInvestment(investmentId);
        setIsConfirmModalOpen(false);
        setSelectedRequest(null);
      },
      onError: () => {
        setIsConfirmModalOpen(false);
        setSelectedRequest(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 bg-gray-800 text-white  shadow-md ">
        <p className="text-xl font-semibold animate-pulse">
          Loading claim requests...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-48 bg-red-800 text-white  shadow-md ">
        <p className="text-xl font-semibold">
          Error loading claim requests:{" "}
          {(error as Error)?.message || "An unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="h-full max-h-[50%] overflow-y-auto text-gray-100 font-sans">
        <h2 className="text-2xl font-extrabold text-black mb-4 text-start drop-shadow-lg">
          Claim Requests
        </h2>
        {claimRequests && claimRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sm:px-6"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sm:px-6"
                  >
                    Owner Address
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sm:px-6"
                  >
                    Profit
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sm:px-6"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sm:px-6"
                  >
                    Token
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sm:px-6"
                  >
                    Duration (Weeks)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sm:px-6"
                  >
                    Unlock Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sm:px-6"
                  >
                    Created At
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sm:px-6"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {claimRequests.map((request) => (
                  <tr
                    key={request.id}
                    style={{
                      backgroundColor: ownerColors[request.ownerAddress],
                    }}
                    className="hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 sm:px-6">
                      {request.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 sm:px-6 truncate max-w-xs">
                      {request.ownerAddress}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 sm:px-6">
                      {request.profit}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 sm:px-6">
                      {request.amount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 sm:px-6">
                      {request.tokenName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 sm:px-6">
                      {request.durationWeeks}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 sm:px-6">
                      {new Date(request.unlockDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 sm:px-6">
                      {new Date(request.createdAt!).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sm:px-6">
                      <button
                        onClick={() => handleCompleteClick(request)}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold py-2 px-3 rounded-md shadow-sm transition-colors duration-150 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Complete & Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-48 text-gray-400 ">
            <p className="text-center text-gray-600 mt-8 text-lg">
              No claim requests found.
            </p>
          </div>
        )}
      </div>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action will complete the claim and permanently delete the
              request and its associated investment. This cannot be undone.
              <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-800">
                <p>
                  <strong className="font-semibold">Request ID:</strong>{" "}
                  {selectedRequest?.id}
                </p>
                <p>
                  <strong className="font-semibold">Amount:</strong>{" "}
                  {selectedRequest?.amount} {selectedRequest?.tokenName}
                </p>
                <p>
                  <strong className="font-semibold">Owner:</strong>{" "}
                  <span className="font-mono text-xs break-all">
                    {selectedRequest?.ownerAddress}
                  </span>
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="cursor-pointer"
                type="button"
                variant="secondary"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
              onClick={handleConfirmComplete}
              disabled={isDeletingClaim || isDeletingInvestment}
              variant="destructive"
            >
              {isDeletingClaim || isDeletingInvestment
                ? "Completing..."
                : "Confirm & Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClaimRequestsList;
