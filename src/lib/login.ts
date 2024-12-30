"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { compareHash } from "@/utils/encryption";

export const checkVerifiedStatus = async (
  email: string,
  password: string,
): Promise<ActionResponse<{ is_verified: boolean }>> => {
  try {
    const user = await prisma.userAuth.findUnique({ where: { userEmail: email } });
    if (!user) return ActionResponses.notFound(`Email atau password salah`);

    if (user.password && !compareHash(password, user.password))
      return ActionResponses.notFound(`Email atau password salah`);


    return ActionResponses.success({ is_verified: true });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Terjadi kesalahan");
  }
};
