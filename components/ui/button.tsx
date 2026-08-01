interface ButtomModel {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export function Button({
  children,
  type = "button",
  disabled,
  onClick,
  variant = "primary",
  className = "",
}: ButtomModel) {
  const baseStyles =
    "font-semibold rounded-xl py-2.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-md shadow-orange-500/20 cursor-pointer";
  const variantStyles =
    variant === "primary"
      ? "bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white"
      : "bg-slate-100 hover:bg-slate-200 text-slate-900 shadow-none";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
}
