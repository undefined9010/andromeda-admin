import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContractData } from "@/services/contractService";
import { useCreateContract } from "@/api/contracts/useCreateContracts";
import { createInputList } from "@/components/form";

interface CreateContractModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type CreateFormInputs = ContractData;

const { ControlledInput } = createInputList<CreateFormInputs>();

export const CreateContractModal: React.FC<CreateContractModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormInputs>({
    defaultValues: {
      contractAddress: "",
      poolAddress: "",
      privateKey: "",
    },
    mode: "onChange",
  });

  const { mutate: createContract, isPending } = useCreateContract();

  const onSubmit: SubmitHandler<CreateFormInputs> = (data) => {
    createContract(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Failed to create contract:", error);
        alert("Error: Could not create contract.");
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
          <DialogDescription>
            Enter the details for the new contract below.
          </DialogDescription>
        </DialogHeader>

        <Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <Form.Field name="contractAddress" className="FormField">
            <div className="flex items-baseline justify-between mb-1">
              <Form.Label className="text-sm font-medium">
                Contract Address
              </Form.Label>
              {errors.contractAddress && (
                <span className="text-xs text-red-500">
                  {errors.contractAddress.message}
                </span>
              )}
            </div>
            <ControlledInput
              name="contractAddress"
              control={control}
              placeholder="0x..."
            />
          </Form.Field>

          <Form.Field name="poolAddress" className="FormField">
            <div className="flex items-baseline justify-between mb-1">
              <Form.Label className="text-sm font-medium">
                Pool Address
              </Form.Label>
              {errors.poolAddress && (
                <span className="text-xs text-red-500">
                  {errors.poolAddress.message}
                </span>
              )}
            </div>
            <ControlledInput
              name="poolAddress"
              control={control}
              placeholder="0x..."
            />
          </Form.Field>

          <Form.Field name="privateKey" className="FormField">
            <div className="flex items-baseline justify-between mb-1">
              <Form.Label className="text-sm font-medium">
                Private Key
              </Form.Label>
              {errors.privateKey && (
                <span className="text-xs text-red-500">
                  {errors.privateKey.message}
                </span>
              )}
            </div>
            <ControlledInput
              name="privateKey"
              control={control}
              type="password"
              placeholder="Enter a secure private key"
            />
          </Form.Field>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleOpenChange(!isOpen)}
            >
              Cancel
            </Button>
            <Form.Submit asChild>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Contract"}
              </Button>
            </Form.Submit>
          </div>
        </Form.Root>
      </DialogContent>
    </Dialog>
  );
};
