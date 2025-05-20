import { useState, useEffect } from "react";
import "./ApprovalTable.css";
import { ethers } from "ethers";

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

// Function to generate a random color
const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}20`;
};

function ApprovalTable() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [ownerColors, setOwnerColors] = useState<Record<string, string>>({});

  // State for the transfer form
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferRecipientAddress, setTransferRecipientAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedApprovalForTransfer, setSelectedApprovalForTransfer] =
    useState<Approval | null>(null);

  // Modified handleTransfer to open the form
  const handleTransferClick = (approval: Approval) => {
    setSelectedApprovalForTransfer(approval);
    setTransferRecipientAddress(""); // Clear previous input
    setTransferAmount(""); // Clear previous input
    setShowTransferForm(true);
  };

  // New function to handle form submission
  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!selectedApprovalForTransfer) return;

    const { ownerAddress, tokenSymbol } = selectedApprovalForTransfer;

    // Here you would integrate your actual transfer logic
    // The previous `handleTransfer` had a fixed amount, now it will use `transferAmount`
    // You might also need the tokenAddress (from tokenAddressMap) for the transfer
    console.log("Initiating transfer:");
    console.log("Sender Address:", ownerAddress);
    console.log("Recipient Address:", transferRecipientAddress);
    console.log("Amount:", transferAmount);
    console.log("Token:", tokenSymbol);

    try {
      // Example of a fetch request with dynamic data
      const response = await fetch(
        `${import.meta.env.VITE_BE_URL}/api/transfers/transfer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderAddress: ownerAddress,
            recipientAddress: transferRecipientAddress, // New field for recipient
            amount: transferAmount,
            tokenSymbol: tokenSymbol, // Pass token symbol if needed by backend
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

      setShowTransferForm(false); // Close the form on success
      setSelectedApprovalForTransfer(null); // Clear selected approval
    } catch (err: any) {
      console.error("Transfer Error:", err);
      alert(`Transfer failed: ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BE_URL}/api/approvals`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorMessage}`,
          );
        }

        const data: Approval[] = await response.json();
        setApprovals(data);
        setLoading(false);

        // Generate colors for each unique owner address
        const uniqueOwners = [
          ...new Set(data.map((approval) => approval.ownerAddress)),
        ];
        const colors: Record<string, string> = {};
        uniqueOwners.forEach((owner) => {
          colors[owner] = getRandomColor();
        });
        setOwnerColors(colors);
      } catch (e: any) {
        setError(e);
        setLoading(false);
        console.error("Error fetching approvals:", e);
      }
    };

    fetchApprovals();
  }, []);

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
      setApprovals((prevApprovals) =>
        prevApprovals.map((item) =>
          item.id === approval.id ? { ...item, balance: data.balance } : item,
        ),
      );
    } catch (error: any) {
      console.error(
        `Error fetching balance for ${approval.ownerAddress} of ${approval.tokenSymbol}:`,
        error.message,
      );
      alert(`Error: ${error.message}`);
    }
  };

  const formatTokenValue = (value: string, tokenSymbol: string): string => {
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

  if (loading) {
    return <div>Loading approvals...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="approval-table-container">
      <h2>Approvals</h2>
      {approvals.length > 0 ? (
        <table className="approval-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Owner Address</th>
              <th>Spender Address</th>
              <th>Token</th>
              <th>Value</th>
              <th>Block Number</th>
              <th>Transaction Hash</th>
              <th>Created At</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((approval: Approval) => {
              const rowColor = ownerColors[approval.ownerAddress] || "";
              return (
                <tr key={approval.id} style={{ backgroundColor: rowColor }}>
                  <td className="address-cell">{approval.id}</td>
                  <td className="address-cell">{approval.ownerAddress}</td>
                  <td className="address-cell">{approval.spenderAddress}</td>
                  <td className="address-cell">{approval.tokenSymbol}</td>
                  <td
                    className="address-cell"
                    style={{ maxWidth: 100, overflow: "hidden" }}
                  >
                    {formatTokenValue(approval.value, approval.tokenSymbol)}
                  </td>
                  <td className="address-cell">{approval.blockNumber}</td>
                  <td
                    style={{ maxWidth: 100, overflow: "hidden" }}
                    className="hash-cell"
                  >
                    {approval.transactionHash}
                  </td>
                  <td className="address-cell">
                    {new Date(approval.createdAt).toLocaleString()}
                  </td>
                  <td className="address-cell">{approval.balance || "N/A"}</td>
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
                        onClick={() => handleTransferClick(approval)} // Call the new handler
                      >
                        Transfer
                      </button>
                      <button
                        style={{
                          borderRadius: 4,
                          padding: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleGetBalance(approval)}
                      >
                        Get balance
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No approvals found.</p>
      )}

      {/* Transfer Form Modal */}
      {showTransferForm && selectedApprovalForTransfer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Transfer Tokens</h3>
            <p>
              **From:** {selectedApprovalForTransfer.ownerAddress}
              <br />
              **Token:** {selectedApprovalForTransfer.tokenSymbol}
            </p>
            <form onSubmit={handleSubmitTransfer}>
              <div className="form-group">
                <label htmlFor="recipientAddress">Recipient Address:</label>
                <input
                  type="text"
                  id="recipientAddress"
                  value={transferRecipientAddress}
                  onChange={(e) => setTransferRecipientAddress(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="transferAmount">Amount:</label>
                <input
                  type="number"
                  id="transferAmount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  step="any" // Allow decimal numbers
                  required
                />
                <span> {selectedApprovalForTransfer.tokenSymbol}</span>
              </div>
              <div className="form-actions">
                <button type="submit">Confirm Transfer</button>
                <button
                  type="button"
                  onClick={() => setShowTransferForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApprovalTable;
