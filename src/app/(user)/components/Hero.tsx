/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import hipster from "@/../public/img/hipsterP.png";
import setting from "@/../public/img/settingsP.png";
import { Prisma } from "@prisma/client";
import {
  FileFullPayload,
  GenreFullPayload,
  userFullPayload,
} from "@/utils/relationsip";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addLike, addViews } from "@/utils/server-action/userGetServerSession";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { SearchInput } from "./input";
import { FileCard, UserProfileCard } from "./card";
import { PageContainer } from "@/app/components/layout/PageContainer";


// Type Definitions
export interface MainProps {
  ListData: FileFullPayload[];
  session?: any;
  currentUser?: userFullPayload;
  genre?: GenreFullPayload[];
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "base";
  children: React.ReactNode;
}

export interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isMobile?: boolean;
}

export interface UserProfileCardProps {
  currentUser: Prisma.UserGetPayload<{}>;
  session: any;
}

export interface FileCardProps {
  file: FileFullPayload;
  onLike?: () => void;
  onRead: () => void;
  user?: userFullPayload;
}

const Main: React.FC<MainProps> = ({
  ListData,
  session,
  currentUser,
  genre,
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [selected, setSelected] = useState<string>("All");
  const [filteredUser, setFilteredUser] = useState<FileFullPayload[]>(ListData);
  const [like, setLike] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const filterUsers = () => {
      const filteredByName = ListData.filter((file: FileFullPayload) =>
        file.filename.toLowerCase().includes(searchInput.toLowerCase())
      );

      const finalFilteredUsers =
        selected === "All" 
          ? filteredByName
          : ListData.filter(
              (dataList: FileFullPayload) => dataList.genre === selected
            )
      setFilteredUser(finalFilteredUsers);
    };

    filterUsers();
  }, [ListData, searchInput, selected]);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const addLikes = async (file: FileFullPayload) => {
    setLike(!like);
    const loading = toast.loading("Loading...");

    try {
      const update = await addLike(
        file.id,
        like ? file.Like - 1 : file.Like + 1
      );

      if (!update) {
        toast.error("Gagal Menambahkan Like");
        return;
      }

      toast.success("Success", { id: loading });
      return update;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  if (!genre) return <>Internal Server Error</>;
  const filteredGenre = [...new Set(genre.map((g) => g.Genre))];

  if (!ListData || !genre) return <div>Loading...</div>;

  return (
    <PageContainer>
      <section className="max-w-full mx-auto xl:mx-48 md:flex gap-x-4 px-4 xl:px-0">
        <div className="block md:hidden mb-4">
          <SearchInput
            value={searchInput}
            onChange={handleSearchInput}
            isMobile
          />
        </div>

        <div className="lg:w-5/12">
          <div className="grid grid-cols-1 gap-4">
            {currentUser && session && (
              <UserProfileCard currentUser={currentUser} session={session} />
            )}

            <div className="w-full px-10 bg-white rounded-3xl py-4">
              <h2 className="py-4 font-Quicksand text-xl font-light text-slate-500">
                Manage your File
              </h2>

              <RadioGroup.Root
                className="flex flex-col gap-2"
                value={selected}
                onValueChange={(value: string) => setSelected(value)}>
                <RadioGroup.Item
                  value="All"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-100">
                  <Image src={setting} width={30} alt="all" />
                  <span className="text-slate-500">All</span>
                </RadioGroup.Item>

                {filteredGenre.map((genreItem) => (
                  <RadioGroup.Item
                    key={genreItem}
                    value={genreItem}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-100">
                    <Image src={hipster} width={30} alt={genreItem} />
                    <span className="text-slate-500">{genreItem}</span>
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="hidden md:block">
            <SearchInput value={searchInput} onChange={handleSearchInput} />
          </div>

          {filteredUser.length > 0 ? (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 bg-white rounded-xl p-8 mt-4">
              {filteredUser.map((file, i) => (
                <FileCard
                  key={i}
                  file={file}
                  onLike={() => addLikes(file)}
                  onRead={() => {
                    router.push(file.path);
                    addViews(file.id, file.views + 1);
                  }}
                  user={currentUser}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white px-2 py-10">
              <h1 className="text-center text-xl">
                Oops! Data Tidak Ditemukan
              </h1>
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  );
};

export default Main;
