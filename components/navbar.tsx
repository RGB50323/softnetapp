"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/ui/logout-button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/lib/i18n/language-context";

const links = [
  { href: "/dashboard", labelKey: "nav.dashboard", fallback: "Dashboard" },
  { href: "/products", labelKey: "nav.products", fallback: "Productos" },
];

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="w-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg text-black">SOFTNET</span>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t(link.labelKey) ?? link.fallback}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}