/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "./button";
import { SearchInputProps } from "./Hero";

export const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  isMobile = false 
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ml-1 ps-3 pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
    </div>
    <input
      type="search"
      className="block w-full p-4 ps-10 text-sm text-gray-900 border rounded-full border-gray-100 bg-white focus:ring-red-100 focus:ring-2 outline-none focus:border-base"
      placeholder="Search by Name"
      value={value}
      onChange={onChange}
      required
    />
    <Button
      variant="base"
      className="absolute end-2 bottom-2"
      type="submit"
    >
      Search
    </Button>
  </div>
);