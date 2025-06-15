import api from "./api";

export interface ContractData {
  id?: string;
  contractAddress: string;
  poolAddress: string;
  privateKey: string;
  createdAt: string;
  userId: number;
}

export interface CreatedContract {
  id: number;
  contractAddress: string;
  poolAddress: string;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
}

export const createContractAPI = async (
  contractData: ContractData,
): Promise<CreatedContract> => {
  const response = await api.post("/contracts", contractData);
  return response.data;
};

export const deleteContractAPI = async (contractId: number): Promise<void> => {
  await api.delete(`/contracts/${contractId}`);
};

export const getContractsAPI = async (): Promise<ContractData[]> => {
  const response = await api.get("/contracts");
  return response.data;
};
