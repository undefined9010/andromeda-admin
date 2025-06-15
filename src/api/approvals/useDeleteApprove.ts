import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteApproval = async (approvalId: number): Promise<void> => {
  await api.delete(`/approvals/${approvalId}`);
};

export const useDeleteApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (approvalId: number) => deleteApproval(approvalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
