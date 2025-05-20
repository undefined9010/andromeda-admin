import React from "react";
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

interface ApprovalTableRowProps {
  approval: Approval;
  ownerColor: string;
  onTransferClick: (approval: Approval) => void;
  onGetBalance: (approval: Approval) => void;
}

const ApprovalTableRow: React.FC<ApprovalTableRowProps> = ({
  approval,
  ownerColor,
  onTransferClick,
  onGetBalance,
}) => {
  return (
    <tr
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      style={{ backgroundColor: ownerColor }} // Динамический цвет фона остается инлайн
    >
      <td className="py-3 px-4 text-sm font-mono text-gray-800">
        {approval.id}
      </td>
      <td className="py-3 px-4 text-sm font-mono text-gray-800 truncate max-w-[120px]">
        {approval.ownerAddress}
      </td>
      <td className="py-3 px-4 text-sm font-mono text-gray-800 truncate max-w-[120px]">
        {approval.spenderAddress}
      </td>
      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
        {approval.tokenSymbol}
      </td>
      <td className="py-3 px-4 text-sm font-mono text-gray-800 truncate max-w-[100px]">
        {formatTokenValue(approval.value, approval.tokenSymbol)}
      </td>
      <td className="py-3 px-4 text-sm font-mono text-gray-800">
        {approval.blockNumber}
      </td>
      <td className="py-3 px-4 text-sm font-mono text-gray-800 truncate max-w-[100px]">
        {approval.transactionHash}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800">
        {new Date(approval.createdAt).toLocaleString()}
      </td>
      <td className="py-3 px-4 text-sm font-mono text-gray-800">
        {approval.balance || "N/A"}
      </td>
      <td className="py-3 px-4 text-sm">
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => onTransferClick(approval)}
          >
            Transfer
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            onClick={() => onGetBalance(approval)}
          >
            Get balance
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ApprovalTableRow;
