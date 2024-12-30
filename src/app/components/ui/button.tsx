import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-primary-900 text-black hover:bg-primary-950 rounded-lg disabled:bg-neutral-400 disabled:text-white disabled:border-neutral-400",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm rounded-lg hover:bg-destructive/90 disabled:bg-neutral-400 disabled:text-white disabled:border-neutral-400",
        outline:
          "border border-primary-900 text-primary-900 bg-white rounded-lg hover:bg-primary-50 disabled:bg-neutral-400 disabled:text-white disabled:border-neutral-400",
        link: "text-black hover:text-primary-900 disabled:text-neutral-400",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        tag: "text-primary-900 rounded-full bg-primary-50 px-[1.125rem] py-[0.625rem] hover:bg-primary-100",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-14 rounded-md px-8",
        icon: "h-9 w-9",
        link: "w-fit h-fit",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  withArrow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, withArrow, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
        {withArrow && (
          <svg
            width="12"
            className="ml-2 text-black"
            height="7"
            viewBox="0 0 12 7"
            fill="black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.8"
              d="M1 1.00073L6 6.00073L11 1.00073"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
