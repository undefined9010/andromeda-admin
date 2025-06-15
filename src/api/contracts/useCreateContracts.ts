import { createContractAPI, CreatedContract } from "@/services/contractService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractData } from "@/services/contractService.ts";

export const CONTRACTS_QUERY_KEY = "contracts";

export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatedContract, Error, ContractData>({
    mutationFn: createContractAPI,
    onSuccess: (data) => {
      console.log("Contract created successfully:", data);
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Error creating contract:", error.message);
    },
  });
};
