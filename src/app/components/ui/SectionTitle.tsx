import { FC, ReactNode } from "react";
import { Body3 } from "../ui/text";

export const SectionTitle: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <Body3 className="mb-4 w-fit rounded-full bg-primary-50 px-[1.125rem] py-[0.625rem] text-primary-900">
      {children}
    </Body3>
  );
};
