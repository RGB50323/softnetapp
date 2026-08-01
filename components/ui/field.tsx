"use client"

export function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}