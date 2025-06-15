// src/pages/ContractsPage.tsx
import { useState } from "react";
import { useGetContracts } from "@/api/contracts/useGetContractsList";
import { useDeleteContract } from "@/api/contracts/useDestroyContract";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContractsTable } from "@/components/Contracts/ContractsTable.tsx";
import { CreateContractModal } from "@/components/Contracts/CreateContractModal.tsx";

function ContractsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Состояние для модалки создания
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [contractToDeleteId, setContractToDeleteId] = useState<number | null>(
    null,
  );

  const { data: contracts, isLoading, error } = useGetContracts();
  const { mutate: deleteContract, isPending: isDeleting } = useDeleteContract();

  // Открывает диалог подтверждения удаления
  const handleDeleteClick = (contractId: number | undefined) => {
    if (contractId) {
      setContractToDeleteId(contractId);
      setIsDeleteAlertOpen(true);
    }
  };

  // Выполняет удаление
  const handleConfirmDelete = () => {
    if (contractToDeleteId !== null) {
      deleteContract(contractToDeleteId, {
        onSuccess: () => {
          setIsDeleteAlertOpen(false);
          setContractToDeleteId(null);
        },
      });
    }
  };

  if (error) {
    return (
      <p className="p-8 text-red-500">
        Error loading contracts: {error.message}
      </p>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Contracts</h1>
        <Button
          className="cursor-pointer"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New Contract
        </Button>
      </div>

      <ContractsTable
        contracts={contracts || []}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {/* Модальное окно для создания */}
      <CreateContractModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              contract.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="cursor-pointer" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ContractsPage;
