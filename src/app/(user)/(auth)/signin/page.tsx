/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { fetcher } from "@/utils/server-action/Fetcher";
import {  userWithLastLogin } from "@/utils/relationsip";
import { LoginForm } from "./components/hero";

export default function Signin() {
  const router = useRouter();
  const [userData, setUserData] = useState<userWithLastLogin | null>(null);
  const { data: session, status } = useSession();
  const [loading, setIsLoading] = useState(false);

  const { data, error } = useSWR(session ? `/api/user?userId=${session.user?.id}` : null, fetcher, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (data) {
      setUserData(data.user);
    }
  }, [data]);
  

  useEffect(() => {
    if (session && userData) {
      setIsLoading(true);
      if (userData && session) {
        toast.success("Berhasil Login!");
        router.push("/AjukanKarya");
      }
    }
  }, [session, userData, router]);
  
  const handleLogin = async () => {
    setIsLoading(true);
    await signIn("google");
  };

  return (
    <React.Fragment>
      <main className="min-h-screen-minus-10">
        <div className="flex max-w-full w-full h-screen items-center justify-center relative">
          <LoginForm/>
        </div>
      </main>
    </React.Fragment>
  );
}
