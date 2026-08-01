"use client";

import { useLanguage } from "@/lib/i18n/language-context";

export function PageTitle({ i18nKey }: { i18nKey: string }) {
  const { t } = useLanguage();
  return (
    <h1 className="text-2xl font-bold text-slate-900 mb-6">{t(i18nKey)}</h1>
  );
}