import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

export const SectionContainer: FC<{
  children?: ReactNode;
  className?: string;
  id?: string;
}> = (props) => {
  return (
    <section
      {...props}
      className={cn(
        "mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-12 md:py-16",
        props.className,
      )}
    />
  );
};
