import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteClaimRequest = async (requestId: number): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_BE_URL}/withdrawals/${requestId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message ||
        `Failed to delete claim request with ID ${requestId}`,
    );
  }
};

export const useDeleteClaimRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteClaimRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawalRequests"] });
    },
    onError: (error) => {
      console.error("Error deleting claim request:", error.message);
    },
  });
};
