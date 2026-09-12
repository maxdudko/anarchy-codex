"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser, clearError } from "@/store/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations("auth");
  const { isAuthenticated, error, loading } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    pseudonym: "",
    bio: "",
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (form.password !== form.passwordConfirm) {
      setLocalError(t("passwordsMismatch"));
      return;
    }
    const result = await dispatch(
      registerUser({
        email: form.email,
        password: form.password,
        pseudonym: form.pseudonym,
        bio: form.bio,
      })
    );
    if (registerUser.rejected.match(result)) {
      setLocalError(result.payload as string);
    }
  };

  const inputClass =
    "mb-3 block w-full rounded border border-cyan-500 bg-gray-800 p-2 text-cyan-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none";

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <form
        className="mx-auto mt-16 max-w-md rounded-xl border border-cyan-500 bg-gray-900 p-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.2)]"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-2xl font-bold text-cyan-400">{t("register")}</h2>
        <label htmlFor="email" className="text-sm text-pink-400">
          {t("email")}*
        </label>
        <input
          id="email"
          className={inputClass}
          type="email"
          placeholder={t("email")}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
        <label htmlFor="pseudonym" className="text-sm text-pink-400">
          {t("pseudonym")}*
        </label>
        <input
          id="pseudonym"
          className={inputClass}
          type="text"
          placeholder={t("pseudonym")}
          value={form.pseudonym}
          onChange={(e) => setForm((f) => ({ ...f, pseudonym: e.target.value }))}
          required
        />
        <label htmlFor="password" className="text-sm text-pink-400">
          {t("password")}*
        </label>
        <input
          id="password"
          className={inputClass}
          type="password"
          placeholder={t("password")}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
        />
        <label htmlFor="passwordConfirm" className="text-sm text-pink-400">
          {t("confirmPassword")}*
        </label>
        <input
          id="passwordConfirm"
          className={inputClass}
          type="password"
          placeholder={t("confirmPassword")}
          value={form.passwordConfirm}
          onChange={(e) =>
            setForm((f) => ({ ...f, passwordConfirm: e.target.value }))
          }
          required
        />
        <label htmlFor="bio" className="text-sm text-pink-400">
          {t("bio")}
        </label>
        <textarea
          id="bio"
          className={inputClass}
          placeholder={t("bio")}
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
        />
        {localError && <div className="mb-3 text-red-400">{localError}</div>}
        <button
          className="w-full rounded border border-cyan-400 bg-cyan-800 p-2 text-white transition hover:bg-cyan-700 disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? t("registering") : t("register")}
        </button>
        <div className="mt-4 text-sm text-pink-400">
          {t("haveAccount")}{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            {t("login")}
          </Link>
        </div>
      </form>
      <Footer />
    </main>
  );
}
