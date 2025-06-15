import React from "react";
import { ContractData } from "@/services/contractService";

interface ContractsTableProps {
  contracts: ContractData[];
  onDelete: (contractId: number | undefined) => void;
  isLoading: boolean;
}

export const ContractsTable: React.FC<ContractsTableProps> = ({
  contracts,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500 animate-pulse">Loading contracts...</p>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-dashed border-2 border-gray-300">
        <p className="text-gray-500">No contracts found.</p>
      </div>
    );
  }
  return (
    // Main container for the table with shadow and rounded corners
    <div className="shadow-sm border border-gray-200 rounded-lg overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-700">
        {/* Table Head */}
        <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
          <tr>
            <th scope="col" className="px-6 py-3 font-medium">
              User ID
            </th>
            <th scope="col" className="px-6 py-3 font-medium w-[80px]">
              ID
            </th>
            <th scope="col" className="px-6 py-3 font-medium w-[380px]">
              Contract Address
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Pool Address
            </th>

            <th scope="col" className="px-6 py-3 font-medium">
              Created At
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {contracts.map((contract) => (
            <tr
              key={contract.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {contract.userId ?? ""}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {contract.id}
              </td>

              <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600">
                {contract.contractAddress ?? ""}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600">
                {contract.poolAddress ?? ""}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {new Date(contract.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {/* "Destructive" button styled directly with Tailwind */}
                <button
                  onClick={() => onDelete(Number(contract?.id))}
                  className="inline-flex cursor-pointer items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
