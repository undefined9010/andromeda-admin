import { useQuery } from "@tanstack/react-query";
import { CONTRACTS_QUERY_KEY } from "@/api/contracts/useCreateContracts.ts";
import { ContractData, getContractsAPI } from "@/services/contractService.ts";

export const useGetContracts = () => {
  return useQuery<ContractData[], Error>({
    queryKey: [CONTRACTS_QUERY_KEY],
    queryFn: getContractsAPI,
  });
};
