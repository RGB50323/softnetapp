import { ProductStatus, STATUS_COLORS } from "@/lib/models/products";

interface StatusBadgeProps {
  status: ProductStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}
    >
      {label}
    </span>
  );
}