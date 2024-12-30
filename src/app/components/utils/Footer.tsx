"use client";

import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { Body3 } from "../ui/text";
import { NAV_ITEMS } from "./Navbar";
import { buttonVariants } from "../ui/button";

export const Contact = [
  {
    email: "Jean Richnerd Rantabaratrahjaga",
    phone: "+6281235667629",
  },
  {
    email: "Muhammad Chusni Agus, M.Pd., Gr.",
    phone: "+6285106655664",
  },
];

export const Footer: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer
      id="footer"
      className="mx-auto w-full max-w-screen-xl px-6 pb-8 pt-[5.125rem] md:px-12">
      <div className="flex h-full flex-col items-start gap-y-[72px] lg:flex-row lg:justify-between lg:gap-y-0">
        <div className="flex h-full flex-col items-start gap-y-[22px] lg:h-[155px] lg:justify-between lg:gap-y-0">
          <Image
            src={"/img/icon.png"}
            alt="Logo MokletPort"
            width={100.37}
            height={38}
            className="h-auto w-[6.3rem] bg-black rounded-full"
          />
          <Body3 className="text-black">
            &copy; {new Date().getFullYear()} Pengembang MokletPort
          </Body3>
        </div>
        <div className="flex w-full flex-col justify-between lg:h-[155px] lg:max-w-[598px]">
          <div className="mb-11 flex w-full max-w-[598px] flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-0 lg:mb-0">
            {NAV_ITEMS.map((item, index) => (
              <div key={item.label} className="w-full">
                {!item.child ? (
                  <Link
                    href={item.href}
                    className={buttonVariants({
                      variant: "link",
                      size: "link",
                    })}>
                    {item.label}
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => handleToggle(index)}
                      className={`flex w-full justify-between items-center ${buttonVariants(
                        {
                          variant: "link",
                          size: "link",
                        }
                      )}`}>
                      {item.label}
                      <span>{"▼"}</span>
                    </button>
                      <div className="ml-4 mt-2 flex flex-col gap-2">
                        {item.child.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={buttonVariants({
                              variant: "link",
                              size: "link",
                            })}>
                            {subItem.label}
                          </Link>
                        ))}
                      </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="w-fit">
          {Contact.map((contact, i) => (
            <div key={i}>
              <div className="mb-5 flex items-center gap-x-3">
                <Link href={`https://wa.me/${contact.phone}`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-black"
                    xmlns="http://www.w3.org/2000/svg">
                    {/* SVG Content */}
                  </svg>
                </Link>
              </div>
              <Link
                href={`https://wa.me/${contact.phone}`}
                className={buttonVariants({ variant: "link", size: "link" })}>
                {contact.email}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
