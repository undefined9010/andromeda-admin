import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import * as Form from "@radix-ui/react-form";

import { ChangeEvent, ReactElement, ReactNode } from "react";
import { CustomLoader } from "@/components/CustomLoader.tsx";

export type InputFormProps<
  TFieldValuesType extends FieldValues = FieldValues,
  TNameType extends FieldPath<TFieldValuesType> = FieldPath<TFieldValuesType>,
> = {
  name: TNameType;
  control: Control<TFieldValuesType>;
  type?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  balance?: string | undefined;
  symbol?: string;
  icon?: ReactNode;
  maxValue?: number;
  noIcon?: boolean;
  isLoadingBalance?: boolean;
};

export const Input = <
  TFieldValuesType extends FieldValues = FieldValues,
  TNameType extends FieldPath<TFieldValuesType> = FieldPath<TFieldValuesType>,
>(
  props: InputFormProps<TFieldValuesType, TNameType>,
): ReactElement => {
  const {
    control,
    name,
    disabled,
    required,
    placeholder,
    label,
    balance,
    symbol,
    maxValue,
    type,
    noIcon,
    isLoadingBalance,
    icon,
  } = props;

  const { field } = useController({
    name,
    control,
    rules: { required },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = Number(event.target.value);

    if (maxValue !== undefined && value > maxValue) {
      value = maxValue;
    }

    field.onChange(value);
  };

  return (
    <Form.Field name={name}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control asChild>
        <div className="border w-full border-gray-600 h-12 rounded-lg flex items-center justify-between">
          {!noIcon && (
            <span className="h-6 w-6 ml-2 rounded-full flex items-center justify-center shrink-0">
              {icon}
            </span>
          )}

          <input
            {...field}
            value={field.value || ""}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            type={type}
            className={`${noIcon ? "px-6" : "none"} px-2 focus:outline-none w-full focus:ring-0 focus:border-transparent text-green-100`}
            onChange={handleChange}
          />
          {balance &&
            !noIcon &&
            (isLoadingBalance ? (
              <CustomLoader />
            ) : (
              <span className="w-full text-gray-500 text-xs line-clamp-1 text-right pr-2 ">
                max: {balance ?? "0.00"}{" "}
                <span className="hidden sm:inline">{symbol}</span>
              </span>
            ))}
        </div>
      </Form.Control>
    </Form.Field>
  );
};
