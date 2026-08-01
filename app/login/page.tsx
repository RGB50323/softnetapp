"use client";

import { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  /**
   * Form variables to login with flags to handle page status like errors or loading state
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    /**
     * Validations applied into the login form
     */
    if (!email || !password) {
      toast.error(t("login.errorEmptyFields"));
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("login.errorInvalidEmail"));
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      toast.error(t("login.errorInvalidCredentials"));
      setLoading(false);
    } else {
      toast.success(t("login.successMessage"));
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 via-slate-50 to-orange-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
            <span className="text-white font-bold text-xl">S+</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {t("login.title")}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{t("login.subtitle")}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <form
            onSubmit={handleLogin}
            noValidate
            className="flex flex-col gap-5"
          >
            <Input
              id="email"
              label={t("login.emailLabel")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.emailPlaceholder")}
            />

            <Input
              id="password"
              label={t("login.passwordLabel")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {t("login.loadingButton")}
                </span>
              ) : (
                t("login.submitButton")
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} Softnet — {t("login.footer")}
        </p>
      </div>
    </div>
  );
}
