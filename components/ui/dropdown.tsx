"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownOption {
  value: string;
  label: string;
  dot?: string;
}

interface DropdownProps {
  label: string;
  active: boolean;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Dropdown({
  label,
  active,
  options,
  value,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
          active
            ? "border-orange-300 bg-orange-50 text-orange-700"
            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
        }`}
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 min-w-50 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5 py-1.5 max-h-64 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 text-left px-3.5 py-2 text-sm cursor-pointer transition-colors ${
                value === opt.value
                  ? "bg-orange-50 text-orange-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt.dot && (
                <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
