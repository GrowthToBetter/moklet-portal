import { SectionContainer } from "@/app/components/layout/SectionContainer";
import { H1 } from "@/app/components/ui/text";

export default function AccessDenied() {
    return (
        <SectionContainer>
            <H1 className="flex justify-center items-center text-center">Access Denied</H1>
        </SectionContainer>
    )
}