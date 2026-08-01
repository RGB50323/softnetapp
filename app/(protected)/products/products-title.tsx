"use client";

import { useLanguage } from "@/lib/i18n/language-context";

export function ProductsTitle() {
  const { t } = useLanguage();
  return <h1 className="text-2xl font-bold mb-6">{t("products.title")}</h1>;
}