"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { Button } from "@/components/ui/button";

export function ProductsTitle() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">{t("products.title")}</h1>
      <Link href="/products/new">
        <Button type="button">{t("products.newProduct")}</Button>
      </Link>
    </div>
  );
}