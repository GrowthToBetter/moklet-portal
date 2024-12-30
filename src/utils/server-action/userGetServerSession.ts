/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { Gender, Genre, RequestStatus, Role, Type } from "@prisma/client";
import prisma from "@/lib/prisma";
import { createUser, updateUser } from "../user.query";
import { revalidatePath } from "next/cache";
import { nextGetServerSession } from "@/lib/authOption";
import { hash } from "bcrypt";
import { FileFullPayload, userFullPayload } from "../relationsip";

export const UpdateUserById = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();

    const id = session?.user?.id;

    const email = data.get("email") as string;
    const photo_profile = data.get("photo_profile") as string;
    const name = data.get("name") as string;
    const role = data.get("role") as Role;
    const clasess = data.get("classes") as Type;
    const absent = data.get("absent") as string;
    const Phone = data.get("phone") as string;
    const gender = data.get("gender") as Gender;
    if (!id) {
      const create = await createUser({
        email,
        photo_profile,
        name,
        role,
        clasess,
        absent,
        Phone,
        gender,
      });
      if (!create) throw new Error("Failed to create");

      return create;
    } else if (id) {
      const findUserWithId = await prisma.user.findUnique({
        where: { id },
      });
      const update = await updateUser(
        { id: id ?? findUserWithId?.id },
        {
          email: email ?? findUserWithId?.email,
          name: name ?? findUserWithId?.name,
          absent: absent ?? findUserWithId?.absent,
          clasess: clasess ?? findUserWithId?.clasess,
          Phone: Phone ?? findUserWithId?.Phone,
          gender: gender ?? findUserWithId?.gender,
          role: role ?? findUserWithId?.role,
          photo_profile: photo_profile ?? findUserWithId?.photo_profile,
        }
      );
      if (!update) throw new Error("Update failed");
      revalidatePath("/profile");
      return update;
    } else {
      throw new Error("Email already exists");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateStatus = async (id: string, data: FormData) => {
  try {
    const status = data.get("status") as RequestStatus;
    const update = await prisma.fileWork.update({
      where: { id: id },
      data: {
        status,
      },
    });
    if (!update) {
      throw new Error("eror");
    }
    revalidatePath("/AjukanKarya");
    return update;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const updateUploadFileByLink = async (data: FormData) => {
  try {
    const name = data.get("name") as string;
    const type = data.get("type") as string;
    const classes = data.get("classes") as Type;
    const genre = data.get("genre") as string;
    const description = data.get("description") as string;
    if (!genre) {
      throw new Error("eror");
    }
    const url = data.get("url") as string;
    const userId = data.get("userId") as string;
    const user = {
      connect: {
        id: userId,
      },
    };
    const role = data.get("role") as Role;
    const uploadedFile = await prisma.fileWork.create({
      data: {
        filename: name,
        genre,
        path: url,
        userType: classes,
        userId: user.connect.id,
        type,
        description,
        userRole: role,
      },
    });
    if (!uploadedFile) {
      throw new Error("eror");
    }
    revalidatePath("/AjukanKarya");
    return uploadedFile;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const UpdateGenreByIdInAdmin = async (
  userData: userFullPayload,
  id: string,
  data: FormData
) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (userData?.role !== "ADMIN") {
      return { status: 401, message: "Unauthorize" };
    }
    const Genre = data.get("Genre") as string;

    const findEmail = await prisma.genre.findFirst({
      where: { Genre },
    });

    if (!findEmail && id == null) {
      const create = await prisma.genre.create({
        data: {
          Genre,
        },
      });
      if (!create) throw new Error("Failed to create admin!");
      revalidatePath("/admin");
      return { status: 200, message: "Create Success!" };
    } else if (id) {
      const findUser = await prisma.genre.findUnique({
        where: { id },
      });
      if (findUser) {
        const update = await prisma.genre.update({
          where: { id: id ?? findUser?.id },
          data: {
            Genre,
          },
        });
        console.log(update);
        if (!update) throw new Error("Failed to update admin!");
        revalidatePath("/admin");
        return { status: 200, message: "Update Success!" };
      } else throw new Error("User not found!");
    }
    revalidatePath("/admin");
    return { status: 200, message: "Update Success!" };
  } catch (error) {
    console.error("Error update user:", error);
    throw new Error((error as Error).message);
  }
};
export const UpdateUserByIdInAdmin = async (
  userData: userFullPayload,
  id: string,
  data: FormData
) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (userData?.role !== "ADMIN") {
      return { status: 401, message: "Unauthorize" };
    }
    const email = data.get("email") as string;
    const name = data.get("name") as string;
    const password = data.get("password") as string;
    const role = data.get("role") as Role;

    const findEmail = await prisma.user.findUnique({
      where: { email },
      include: { userAuth: true },
    });

    if (!findEmail && id == null) {
      const create = await prisma.user.create({
        data: {
          email,
          name,
          role,
          userAuth: {
            create: {
              password: await hash(password, 10),
              last_login: new Date(),
            },
          },
        },
      });
      if (!create) throw new Error("Failed to create admin!");
      revalidatePath("/admin");
      return { status: 200, message: "Create Success!" };
    } else if (id) {
      const findUser = await prisma.user.findFirst({
        where: { id },
        include: { userAuth: true },
      });
      if (findUser) {
        const update = await prisma.user.update({
          where: { id: id ?? findUser?.id },
          data: {
            name: name ?? findUser?.name,
            email: email ?? findUser?.email,
            role: role ?? (findUser?.role as Role),
            userAuth: {
              update: {
                last_login: new Date(),
              },
            },
          },
        });
        console.log(update);
        if (!update) throw new Error("Failed to update admin!");
        revalidatePath("/admin");
        return { status: 200, message: "Update Success!" };
      } else throw new Error("User not found!");
    }
    revalidatePath("/admin");
    return { status: 200, message: "Update Success!" };
  } catch (error) {
    console.error("Error update user:", error);
    throw new Error((error as Error).message);
  }
};

export const UpdateAdminById = async (
  id: string,
  data: FormData,
  userData: userFullPayload
) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (userData?.role !== "ADMIN") {
      return { status: 401, message: "Unauthorize" };
    }
    const email = data.get("email") as string;
    const name = data.get("name") as string;
    const password = data.get("password") as string;
    const role = data.get("role") as Role;

    const findEmail = await prisma.user.findUnique({
      where: { email },
      include: { userAuth: true },
    });

    if (!findEmail && id == null) {
      const create = await prisma.user.create({
        data: {
          email,
          name,
          role,
          userAuth: {
            create: {
              password: await hash(password, 10),
              last_login: new Date(),
            },
          },
        },
      });
      if (!create) throw new Error("Failed to create admin!");
      revalidatePath("/admin");
      return { status: 200, message: "Create Success!" };
    } else if (id) {
      const findUser = await prisma.user.findFirst({
        where: { id },
        include: { userAuth: true },
      });
      if (findUser) {
        const update = await prisma.user.update({
          where: { id: id ?? findUser?.id },
          data: {
            name: name ?? findUser?.name,
            email: email ?? findUser?.email,
            role: role ?? (findUser?.role as Role),
            userAuth: {
              update: {
                last_login: new Date(),
              },
            },
          },
        });
        console.log(update);
        if (!update) throw new Error("Failed to update admin!");
        revalidatePath("/admin");
        return { status: 200, message: "Update Success!" };
      } else throw new Error("User not found!");
    }
    revalidatePath("/admin");
    return { status: 200, message: "Update Success!" };
  } catch (error) {
    console.error("Error update user:", error);
    throw new Error((error as Error).message);
  }
};

export const DeleteGenre = async (id: string, userData: userFullPayload) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (userData.role === "SISWA") {
      return { status: 401, message: "Unauthorize" };
    }
    const del = await prisma.genre.delete({
      where: { id },
    });
    if (!del) {
      return { status: 400, message: "Failed to delete user!" };
    }
    revalidatePath("/admin/studentData");
    revalidatePath("/admin");
    return { status: 200, message: "Delete Success!" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error((error as Error).message);
  }
};

export const DeleteUser = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (session?.user.role === "SISWA") {
      return { status: 401, message: "Unauthorize" };
    }
    const del = await prisma.user.delete({
      where: { id },
    });
    if (!del) {
      return { status: 400, message: "Failed to delete user!" };
    }
    revalidatePath("/admin/studentData");
    revalidatePath("/admin");
    return { status: 200, message: "Delete Success!" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error((error as Error).message);
  }
};

export const DeleteFile = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    const del = await prisma.fileWork.delete({
      where: { id },
    });

    if (!del) {
      return { status: 400, message: "Failed to delete from database!" };
    }

    revalidatePath("/AjukanKarya");
    return { status: 200, message: "Delete Success!" };
  } catch (error) {
    console.error("Error in DeleteFile:", error);
    return {
      status: 500,
      message: `Error deleting file: ${(error as Error).message}`,
    };
  }
};

export const updateRole = async (id: string, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session) {
      throw new Error("eror");
    }

    const role = data.get("role") as Role;
    const update = await prisma.user.update({
      where: { id: id },
      data: {
        role,
      },
    });
    if (!update) {
      throw new Error("eror");
    }
    revalidatePath("/admin/studentData");
    revalidatePath("/pilihRole");
    return update;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const DeleteRoleFileFromNotif = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (!session) {
      throw new Error("eror");
    }

    const role = "DELETE" as Role;
    const update = await prisma.fileWork.update({
      where: { id: id },
      data: {
        userRole: role,
      },
    });
    if (!update) {
      throw new Error("eror");
    }
    revalidatePath("/profile/notification/Validasi");
    return update;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addLike = async (id: string, like: number) => {
  try {
    const update = await prisma.fileWork.update({
      where: {
        id: id,
      },
      data: {
        Like: like,
      },
    });
    if (!update) {
      throw new Error("Gagal Menambahkan Like");
    }
    revalidatePath("/");
    return update;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const addViews = async (id: string, views: number) => {
  try {
    const update = await prisma.fileWork.update({
      where: {
        id: id,
      },
      data: {
        views,
      },
    });
    if (!update) {
      throw new Error("Gagal Menambahkan Like");
    }
    revalidatePath("/");
    return update;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const UpdateGeneralProfileById = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();

    const id = session?.user?.id;

    const email = data.get("email") as string;
    const photo_profile = data.get("photo_profile") as string;
    const name = data.get("name") as string;
    const role = data.get("role") as Role;
    const clasess = data.get("classes") as Type;
    const absent = data.get("absent") as string;
    const Phone = data.get("Phone") as string;
    const gender = data.get("gender") as Gender;

    if (!id) {
      const create = await createUser({
        email,
        photo_profile,
        name,
        role,
        clasess,
        absent,
        Phone,
        gender,
      });
      if (!create) throw new Error("Failed to create");
    } else if (id) {
      const findUserWithId = await prisma.user.findUnique({
        where: { id },
      });

      const update = await updateUser(
        { id: id ?? findUserWithId?.id },
        {
          email: email ?? findUserWithId?.email,
          name: name ?? findUserWithId?.name,
          absent: absent ?? findUserWithId?.absent,
          clasess: clasess ?? findUserWithId?.clasess,
          Phone: Phone ?? findUserWithId?.Phone,
          role: role ?? findUserWithId?.role,
          photo_profile: photo_profile ?? findUserWithId?.photo_profile,
        }
      );
      if (!update) throw new Error("Update failed");
    } else {
      throw new Error("Email already exists");
    }
    revalidatePath("/profile");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const commentFile = async (
  comment: string,
  file: { connect: { id: string } },
  user: { connect: { id: string } }
) => {
  try {
    const createComment = await prisma.comment.create({
      data: {
        file: {
          connect: {
            id: file.connect.id,
          },
        },
        user: {
          connect: {
            id: user.connect.id,
          },
        },
        Text: comment,
      },
    });
    if (!createComment) {
      throw new Error("eror");
    }
    return createComment;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

