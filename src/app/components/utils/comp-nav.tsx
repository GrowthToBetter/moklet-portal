"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { NAV_ITEMS } from "./Navbar";



export default function NavbarComp() {
  const [modal, setModal] = useState<boolean>(false);
  const [prof, setProf] = useState<boolean>(false);
  const pathName = usePathname();
  const { data: session, status } = useSession();

  const handleProf = () => {
    setProf(!prof);
  };

  const handleClick = () => {
    setModal(!modal);
  };

  return (
    <>
      {pathName !== "/AccessDenied" ? (
        <main className="mb-12">
          <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="min-w-max flex flex-wrap items-center justify-between mx-auto p-4 lg:px-20">
              <Link href="#" className="flex items-center space-x-3">
                <div>
                  <h1 className="text-2xl text-black font-bold">
                    MokletPortal
                    <p className="indent-1 text-center justify-center items-center flex text-sm font-normal text-black tracking-widest">
                      <Image
                        src={"/img/icon.png"}
                        width={25}
                        className="bg-black rounded-full"
                        height={25}
                        alt={"icon"}
                      />
                      Moklet Portal for Portfolio Of Remarkable Talent
                    </p>
                  </h1>
                </div>
              </Link>
              <div className="flex md:order-2 space-x-3 md:space-x-0">
                <div>
                  {status === "unauthenticated" ? (
                    <button
                      onClick={() => signIn()}
                      className="focus:outline-none text-black bg-Primariy hover:bg-slate-100 focus:ring focus:ring-slate-100 font-medium rounded-full border border-slate-300 text-sm px-5 py-2.5 me-2 mb-2">
                      Sign In
                    </button>
                  ) : (
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleProf}
                        withArrow
                        className="flex justify-center gap-x-2 py-2 px-4">
                        <Image
                          src={session?.user?.image ?? "/default-avatar.png"}
                          alt="user image"
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                      </Button>
                      {prof && (
                        <div className="w-full p-2 max-w-56 bg-white mt-1 border border-slate-300 rounded-lg fixed right-12 top-24 inline-block">
                          <Button
                            onClick={() => signOut({ callbackUrl: "/signin" })}
                            variant="outline"
                            className="w-full mx-auto text-sm text-black border-t-2 border-Primary">
                            Sign Out
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  data-collapse-toggle="navbar-sticky"
                  type="button"
                  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-Secondary focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400"
                  aria-controls="navbar-sticky"
                  aria-expanded="false"
                  onClick={handleClick}>
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h15M1 7h15M1 13h15"
                    />
                  </svg>
                </button>
              </div>
              <div
                className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                id="navbar-sticky">
                <ul className="flex flex-col ltr:space-x-reverse items-center justify-center p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-md-lg md:space-x-8 md:flex-row md:mt-0 md:border-0 opacity-80">
                  {NAV_ITEMS.map((item, index) => (
                    <li key={index}>
                      {item.child ? (
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="text-black rounded-md hover:text-black hover:bg-white duration-200 hover:border-2 p-2">
                              {item.label}
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content
                            className="bg-white border border-gray-200 rounded-md p-2 shadow-lg"
                            sideOffset={5}>
                            {item.child.map((childItem, childIndex) => (
                              <DropdownMenu.Item key={childIndex} asChild>
                                <Link
                                  href={childItem.href}
                                  className={`${
                                    pathName === childItem.href
                                      ? "text-red-500 border-2 bg-white border-Primary"
                                      : "text-black"
                                  } rounded-md hover:text-black hover:bg-white duration-200 hover:border-2 p-2 block`}>
                                  {childItem.label}
                                </Link>
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      ) : (
                        <Link
                          href={item.href}
                          className={`${
                            pathName === item.href
                              ? "text-red-500 border-2 bg-white border-Primary"
                              : "text-black"
                          } rounded-md hover:text-black hover:bg-white duration-200 hover:border-2 p-2`}>
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </main>
      ) : (
        <></>
      )}
    </>
  );
}
