import React, { useState, useEffect } from "react";
import "./ClaimRequests.css";
import { ClaimRequest, useClaimsList } from "../../api/claims/useClaimsList.ts";
import { useDeleteClaimRequest } from "../../api/claims/useDeleteClaim.ts";
import { useDeleteInvestment } from "../../api/investments/useDeleteInvestment.ts";

// Function to generate a random color
const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}40`; // Slightly more opaque
};

const ClaimRequestsList: React.FC = () => {
  const { data: claimRequests, isLoading, isError, error } = useClaimsList();
  const [ownerColors, setOwnerColors] = useState<Record<string, string>>({});

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

  const { mutate: deleteClaimRequest } = useDeleteClaimRequest();
  const { mutate: deleteInvestment } = useDeleteInvestment();

  const handleComplete = (request: ClaimRequest) => {
    if (!request.id && !request.investmentId) return;

    deleteClaimRequest(Number(request.id), {
      onSuccess: () => deleteInvestment(request.investmentId),
    });
  };

  if (isLoading) {
    return <div>Loading claim requests...</div>;
  }

  if (isError) {
    return <div>Error loading claim requests: {(error as Error).message}</div>;
  }

  console.log(claimRequests, "claim requests");

  return (
    <div className="claim-requests-list-container">
      <h2>Claim Requests</h2>
      {claimRequests && claimRequests.length > 0 ? (
        <table className="claim-requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Owner Address</th>
              <th>Profit</th>
              <th>Amount</th>
              <th>Token</th>
              <th>Duration (Weeks)</th>
              <th>Unlock Date</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {claimRequests.map((request) => (
              <tr
                key={request.id}
                style={{ backgroundColor: ownerColors[request.ownerAddress] }}
              >
                <td className="address-cell">{request.id}</td>
                <td className="address-cell">{request.ownerAddress}</td>
                <td className="address-cell">{request.profit}</td>
                <td className="address-cell">{request.amount}</td>
                <td className="address-cell">{request.tokenName}</td>
                <td className="address-cell">{request.durationWeeks}</td>
                <td className="address-cell">
                  {new Date(request.unlockDate).toLocaleDateString()}
                </td>
                <td className="address-cell">
                  {new Date(request.createdAt!).toLocaleString()}
                </td>
                <td className="address-cell">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      style={{
                        borderRadius: 4,
                        padding: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleComplete(request)}
                    >
                      Complete and remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No claim requests found.</p>
      )}
    </div>
  );
};

export default ClaimRequestsList;
