import React from "react";
import ApprovalTableRow from "@/components/Approval/ApprovalTableRow.tsx";

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

interface ApprovalTableContentProps {
  approvals: Approval[];
  ownerColors: Record<string, string>;
  onTransferClick: (approval: Approval) => void;
  onGetBalance: (approval: Approval) => void;
}

const titles = [
  "ID",
  "Owner Address",
  "Spender Address",
  "Token",
  "Value",
  "Block Number",
  "Transaction Hash",
  "Created At",
  "Balance",
  "Actions",
];

const ApprovalTableContent: React.FC<ApprovalTableContentProps> = ({
  approvals,
  ownerColors,
  onTransferClick,
  onGetBalance,
}) => {
  if (approvals.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-8 text-lg">
        No approvals found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto max-h-[50%] overflow-y-auto shadow-xl border border-gray-200">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            {titles.map((title) => (
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {approvals.map((approval) => (
            <ApprovalTableRow
              key={approval.id}
              approval={approval}
              ownerColor={ownerColors[approval.ownerAddress] || ""}
              onTransferClick={onTransferClick}
              onGetBalance={onGetBalance}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalTableContent;
