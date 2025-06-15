import { deleteContractAPI } from "@/services/contractService.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CONTRACTS_QUERY_KEY } from "@/api/contracts/useCreateContracts.ts";

export const useDeleteContract = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteContractAPI,
    onSuccess: (_, contractId) => {
      console.log(`Contract with ID ${contractId} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Error deleting contract:", error.message);
    },
  });
};
