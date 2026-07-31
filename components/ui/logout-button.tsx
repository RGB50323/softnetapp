"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";

export function LogoutButton() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="primary"
      disabled={loading}
      onClick={handleLogout}
      className="text-sm py-1.5 px-3 cursor-pointer"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"
            role="status"
            aria-label={t("common.loading")}
          />
          {t("logout.loadingButton")}
        </span>
      ) : (
        t("logout.button")
      )}
    </Button>
  );
}