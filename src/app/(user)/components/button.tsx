import { ButtonProps } from "./Hero";

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "default", 
  className = "",
  ...props 
}) => (
  <button
    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors
      ${variant === "base" 
        ? "bg-base text-Secondary hover:bg-white focus:ring-4 focus:ring-red-400" 
        : "bg-Secondary border border-slate-200 hover:bg-slate-50"
      } ${className}`}
    {...props}
  >
    {children}
  </button>
);