"use client";
import { useCallback, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations("auth");
  const { isAuthenticated, error, loading } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setLocalError(error || "");
    return () => {
      dispatch(clearError());
    };
  }, [error, dispatch]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLocalError("");
      const result = await dispatch(loginUser(form));
      if (loginUser.rejected.match(result)) {
        setLocalError(result.payload as string);
      }
    },
    [form, dispatch]
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <form
        className="mx-auto mt-16 max-w-md rounded-xl border border-cyan-500 bg-gray-900 p-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.2)]"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-2xl font-bold text-cyan-400">{t("login")}</h2>
        <label htmlFor="email" className="text-sm text-pink-400">
          {t("email")}
        </label>
        <input
          id="email"
          className="mb-3 block w-full rounded border border-cyan-500 bg-gray-800 p-2 text-cyan-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          type="email"
          placeholder={t("email")}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
        <label htmlFor="password" className="text-sm text-pink-400">
          {t("password")}
        </label>
        <input
          id="password"
          className="mb-3 block w-full rounded border border-cyan-500 bg-gray-800 p-2 text-cyan-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          type="password"
          placeholder={t("password")}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
        />
        {localError && <div className="mb-3 text-red-400">{localError}</div>}
        <button
          className="w-full rounded border border-cyan-400 bg-cyan-800 p-2 text-white transition hover:bg-cyan-700 disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? t("loggingIn") : t("login")}
        </button>
        <div className="mt-4 text-sm text-pink-400">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-cyan-400 hover:underline">
            {t("register")}
          </Link>
        </div>
      </form>
      <Footer />
    </main>
  );
}
