"use client";

import { PageContainer } from "@/app/components/layout/PageContainer";
import { SectionContainer } from "@/app/components/layout/SectionContainer";
import { buttonVariants } from "@/app/components/ui/button";
import { SectionTitle } from "@/app/components/ui/SectionTitle";
import { Body3, H1 } from "@/app/components/ui/text";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
export const Custom: FC = () => {
  return (
    <PageContainer>
      <SectionContainer className="flex flex-col-reverse items-end justify-between gap-y-24 lg:flex-row">
        <div className="w-full lg:max-w-[57%]">
          <SectionTitle>Tentang Moklet Portal</SectionTitle>
          <H1 className="mb-[1.375rem] text-black">
            Inovasi Mokleters, Solusi Masa Depan
          </H1>
          <Body3 className="mb-12 text-neutral-500">
            Moklet Portfolio adalah platform yang kami sediakan untuk menampilkan product
            moklet yang telah tervalidasi. kami menyediakan platform untuk melakukan pembelian terkait product yang tersedia
          </Body3>
        </div>
        <Image
          src={"/img/cover.png"}
          alt="Tentang Kami"
          width={525}
          height={457}
          className="pointer-events-none h-auto w-full object-cover lg:w-[34%]"
        />
      </SectionContainer>
      <SectionContainer id="custom">
        <div className="flex w-full flex-col-reverse items-end justify-between gap-y-24 lg:flex-row lg:gap-0">
          <div className="w-full lg:max-w-[46%]">
            <SectionTitle>Ajukan</SectionTitle>
            <H1 className="mb-[1.375rem] text-black">
              Ajukan Product Anda Untuk Kami Validasi
            </H1>
            <Body3 className="mb-12 text-neutral-500">
              Kami menyediakan plartform untuk mewadahi product yang kalian
              buat. Sebagai loncatan bagi anda untuk meraih hal yang lebih
              tinggi, anda akan dikenal dan diberi kesempatan untuk
              merealisasikan impian anda.
            </Body3>
            <Link
              href={"https://moklet-port.vercel.app/product"}
              className={buttonVariants({
                variant: "default",
                className: "w-full sm:w-fit",
              })}>
              Ajukan Sekarang <ArrowRight />
            </Link>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};
