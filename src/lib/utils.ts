import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDurationLabel = (weeks: number) => {
  switch (weeks) {
    case 1:
      return "1 Week";
    case 4:
      return "1 Month";
    case 26:
      return "6 Months";
    case 52:
      return "1 Year";
    default:
      return `${weeks} недель`;
  }
};
