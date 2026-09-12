"use client";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, getCurrentUser } from "@/store/slices/authSlice";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations("auth");
  const { user, isAuthenticated, loading, accessToken, hydrated } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (!isAuthenticated && !accessToken) {
      router.push("/login");
    } else if (!user && accessToken) {
      dispatch(getCurrentUser());
    }
  }, [hydrated, isAuthenticated, user, accessToken, dispatch, router]);

  if (!hydrated || (loading && !user)) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
        <Navbar />
        <p className="mt-16 text-center">{t("loading")}</p>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
        <Navbar />
        <p className="mt-16 text-center">{t("notLoggedIn")}</p>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <section className="mx-auto mt-16 max-w-md rounded-xl border border-cyan-500 bg-gray-900 p-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.2)]">
        <h2 className="mb-4 text-2xl font-bold text-cyan-400">{t("profile")}</h2>
        <p className="mb-2 text-pink-400">
          {t("email")}: <span className="text-cyan-200">{user.email}</span>
        </p>
        <p className="mb-2 text-pink-400">
          {t("pseudonym")}:{" "}
          <span className="text-cyan-200">{user.pseudonym}</span>
        </p>
        <p className="mb-2 text-pink-400">
          {t("roles")}:{" "}
          <span className="text-cyan-200">{user.roles?.join(", ")}</span>
        </p>
        <p className="mb-4 text-pink-400">
          {t("bio")}: <span className="text-cyan-200">{user.bio || "—"}</span>
        </p>
        <button
          className="w-full rounded border border-pink-400 bg-pink-900 p-2 text-white transition hover:bg-pink-800"
          onClick={() => {
            dispatch(logout());
            router.push("/login");
          }}
        >
          {t("logout")}
        </button>
      </section>
      <Footer />
    </main>
  );
}
