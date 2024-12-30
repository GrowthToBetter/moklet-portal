import { SectionContainer } from "@/app/components/layout/SectionContainer";
import Hero from "./components/Hero";
import prisma from "@/lib/prisma";
import { nextGetServerSession } from "@/lib/authOption";
import { FileFullPayload } from "@/utils/relationsip";

export default async function Page() {
  const session = await nextGetServerSession();
  const files = await prisma.fileWork.findMany({
    where: { userId: session?.user?.id },
    include:{
        comment:true
    }
  });
  return (
    <SectionContainer>
      <Hero files={files as FileFullPayload[]} />
    </SectionContainer>
  );
}
