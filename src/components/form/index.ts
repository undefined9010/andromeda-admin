import { FC } from "react";

import { FieldValues } from "react-hook-form";
import { Input, InputFormProps } from "@/components/form/ControlledInput.tsx";

export const createInputList = <FV extends FieldValues>() => ({
  ControlledInput: Input as FC<InputFormProps<FV>>,
});
