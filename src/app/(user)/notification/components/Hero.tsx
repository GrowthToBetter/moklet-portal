"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileFullPayload } from "@/utils/relationsip";
import * as Dialog from "@radix-ui/react-dialog";
import { User, MessageSquare, Eye, ThumbsUp, X } from "lucide-react";

export default function Hero({ files  }: { files: FileFullPayload[] }) {
  const [openComment, setOpenComment] = useState<string | null>(null);
  const [openProfile, setOpenProfile] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-w-max py-8 px-4">
      <div className="max-w-6xl w-full space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">
            Status Karya Yang Diajukan
          </h1>
        </div>

        <div className="space-y-4">
          {files && files.length > 0 ? (
            files.map(
              (file) =>
                file.comment.length > 0 && (
                  <div
                    key={file.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-lg font-semibold text-gray-900">
                            {file.filename}
                          </h2>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              file.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : file.status === "DENIED"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                            {file.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye size={16} />
                            <span>{file.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp size={16} />
                            <span>{file.Like} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare size={16} />
                            <span>{file.comment.length} comments</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Dialog.Root
                          open={openComment === file.id}
                          onOpenChange={(open) =>
                            setOpenComment(open ? file.id : null)
                          }>
                          <Dialog.Trigger className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                            Lihat Komentar
                          </Dialog.Trigger>
                          <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl w-full max-w-xl max-h-[80vh] overflow-y-auto">
                              <Dialog.Title className="text-xl font-semibold mb-4">
                                Komentar untuk {file.filename}
                              </Dialog.Title>
                              
                              <div className="flex justify-end">
                                <Dialog.Close className="p-2 hover:bg-gray-100 rounded-full">
                                  <X size={20} />
                                </Dialog.Close>
                              </div>
                              
                              <div className="space-y-4">
                                {file.comment.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <User size={20} className="text-gray-600" />
                                      <span className="font-medium">
                                        {comment.user?.name}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {comment.user?.role}
                                      </span>
                                    </div>
                                    <p className="text-gray-700">{comment.Text}</p>
                                  </div>
                                ))}
                              </div>
                            </Dialog.Content>
                          </Dialog.Portal>
                        </Dialog.Root>

                        <button
                          onClick={() => router.push(file.path)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          Kunjungi
                        </button>
                      </div>
                    </div>
                  </div>
                )
            )
          ) : (
            <div className="text-center py-12 text-gray-500">
              Belum Ada Karya untuk dilihat ...
            </div>
          )}
        </div>
      </div>
      <Dialog.Root
        open={openProfile !== null}
        onOpenChange={(open) => setOpenProfile(open ? openProfile : null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed inset-4 bg-white rounded-xl shadow-xl p-6">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Preview File
            </Dialog.Title>
            
            <div className="h-full flex flex-col">
              <div className="flex justify-end">
                <Dialog.Close className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </Dialog.Close>
              </div>
              
              {openProfile && (
                <div className="flex-1">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`${files.find(f => f.id === openProfile)?.path}&output=embed`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}