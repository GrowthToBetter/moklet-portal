import * as React from "react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Eye, EyeOff, Upload } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// TODO: Adjust according to the design system
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative h-[3.25rem] w-full flex-grow">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className={cn(
            "flex w-full rounded-xl border border-input bg-transparent px-[1.375rem] py-4 text-sm text-black shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <button
            className="absolute right-3 top-1/2 z-[998] flex -translate-y-1/2 items-center px-2 text-neutral-400 transition-all hover:text-neutral-500"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

interface FileInputProps {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  name: string;
  accept: string;
  errorMessage?: string;
  description?: string;
}

const FileField = React.forwardRef<HTMLInputElement, FileInputProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ label, errorMessage, register, name, accept, description }, _ref) => {
    const [fileName, setFileName] = React.useState<string>("");
    const { onChange } = register(name);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      onChange(e);
      if (file) {
        setFileName(file.name);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      onChange(e);
      if (file) {
        setFileName(file.name);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
    };

    return (
      <div className="flex w-full flex-col items-center justify-center py-4">
        <p
          className={`mb-2 self-start ${
            errorMessage ? "text-primary-400" : "text-black"
          }`}
        >
          {label}
        </p>
        <p
          className="mb-4 self-start text-xs"
          dangerouslySetInnerHTML={{ __html: description || "" }}
        ></p>
        <label
          htmlFor={name}
          className={cn(
            "relative w-full cursor-pointer rounded-lg border-2 border-dashed px-6 py-4 transition-all duration-300 hover:cursor-pointer hover:border-solid focus:outline-none",
            errorMessage ? "border-primary-400" : "border-neutral-400",
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-12 w-12 text-neutral-400" />
            <span className="font-medium text-neutral-400">
              {fileName ? fileName : "Drag & drop a file here"}
            </span>
          </div>
          <input
            id={name}
            type="file"
            accept={accept}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            {...register(name)}
            onChange={handleFileChange}
          />
        </label>

        {fileName && (
          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-700">{fileName}</p>
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 text-center">
            <p
              className={cn(
                "mt-[6px] text-sm text-primary-400",
                errorMessage && "text-red-500",
              )}
            >
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    );
  },
);
FileField.displayName = "FileField";

const DateField = ({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={cn(
          "w-full justify-start text-left font-normal",
          !date && "text-muted-foreground",
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
    </PopoverContent>
  </Popover>
);

export { DateField, FileField, Input };
