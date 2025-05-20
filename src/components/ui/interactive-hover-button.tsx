import React from "react";

import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  isLoading?: boolean;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(
  (
    { text = "Button", className, isLoading = false, disabled, ...props },
    ref,
  ) => {
    const isDisabled = isLoading || disabled;

    return (
      <button
        ref={ref}
        className={cn(
          "group relative w-32 h-10 cursor-pointer overflow-hidden rounded-full border bg-background p-2 text-center font-semibold",

          isDisabled ? "cursor-not-allowed" : "hover:text-primary-foreground",
          className,
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-white " />
          </div>
        ) : (
          <>
            <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
              {text}
            </span>

            <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
              <span>{text}</span>
              <ArrowRight className="h-4 w-4" />
            </div>

            <div
              className={cn(
                "absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg",
                "bg-teal-200",
                "transition-all duration-300 ease-in-out",
                "group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8]",
                "group-hover:bg-gradient-to-br",
                "group-hover:from-teal-400",
                "group-hover:to-violet-300",
              )}
            ></div>
          </>
        )}
      </button>
    );
  },
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
