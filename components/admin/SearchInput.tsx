"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher...",
  className,
}: SearchInputProps) {
  return (
    <label className={cn("relative block", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none ring-coral-deep/15 transition placeholder:text-slate-400 focus:border-coral-deep/60 focus:ring-4"
      />
    </label>
  );
}
