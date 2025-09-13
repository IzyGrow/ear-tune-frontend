import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const hearingButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "hearing-button-primary",
        secondary: "hearing-button-secondary",
        outline: "border-2 border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "px-6 py-3 text-sm",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4 text-lg",
        xl: "px-12 py-6 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface HearingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof hearingButtonVariants> {}

const HearingButton = React.forwardRef<HTMLButtonElement, HearingButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(hearingButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
HearingButton.displayName = "HearingButton";

export { HearingButton, hearingButtonVariants };