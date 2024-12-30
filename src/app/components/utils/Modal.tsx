import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@radix-ui/react-dialog";
import { z } from "zod";
import { Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { UpdateUserById } from "@/utils/server-action/userGetServerSession";
import { useZodForm } from "@/utils/use-zod-form";
import { Type } from "@prisma/client";

// Define Zod schema for validation
const profileSchema = z.object({
  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits long")
    .regex(/^62[0-9]+$/, "Phone number must start with 62"),
  classes: z.string().nonempty("Class selection is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type ModalProfileProps = {
  children: ReactNode;
  onClose: () => void;
  title?: string;
  className?: string;
};

export default function ModalProfile({
  children,
  onClose,
  title,
  className,
}: ModalProfileProps) {
  return (
    <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[9999] justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/50">
      <div className="relative p-4 w-full max-w-4xl mt-10 mb-36 mx-auto max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {title || "Edit Profile"}
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
              aria-label="Close">
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                />
              </svg>
            </button>
          </div>
          <div className={`px-8 ${className}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}

type ModalProfilesProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ModalProfiles = ({ isOpen, onClose }: ModalProfilesProps) => {
  const form = useZodForm({
    schema: profileSchema,
    defaultValues: {
      phone: "",
      classes: "",
    },
  });

  const onSubmit = async (values: ProfileFormData) => {
    const toastId = toast.loading("Loading...");
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const data = await UpdateUserById(formData);
      if (!data) {
        toast.error("Update Failed", { id: toastId });
      } else {
        toast.success("Update Success", { id: toastId });
        onClose();
      }
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
          <DialogTitle className="text-lg font-bold">Profile</DialogTitle>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Controller
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="phone"
                    type="text"
                    placeholder="Phone number start with 62"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="classes"
                className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <Controller
                name="classes"
                control={form.control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="classes"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="" disabled>
                      Select a class
                    </option>
                    {Object.values(Type).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                )}
              />
              {form.formState.errors.classes && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.classes.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Submit
            </button>
          </form>

          <DialogClose className="absolute top-3 right-3 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
            &times;
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
