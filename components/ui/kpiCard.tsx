"use client"

export function KpiCard({
  icon,
  label,
  value,
  accentColor = "orange",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accentColor?: "orange" | "green" | "red";
}) {
  const accentStyles = {
    orange: "bg-orange-50 text-orange-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden hover:shadow-md transition-shadow">
      <div
        className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-40 ${accentStyles[accentColor]}`}
      />

      <div className="relative">
        <div
          className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${accentStyles[accentColor]}`}
        >
          {icon}
        </div>

        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}