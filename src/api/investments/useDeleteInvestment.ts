import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteInvestment = async (investmentId: number): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_BE_URL}/investments/${investmentId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message ||
        `Failed to delete investment with ID ${investmentId}`,
    );
  }
};

export const useDeleteInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawalRequests"] });
    },
    onError: (error) => {
      console.error("Error deleting investment:", error.message);
    },
  });
};
