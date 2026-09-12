"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import PageFrame from "@/components/PageFrame";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  logout,
  getCurrentUser,
  updateCurrentProfile,
} from "@/store/slices/authSlice";
import { inputClass, dangerBtnClass, primaryBtnClass } from "@/lib/styles";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations("auth");
  const ta = useTranslations("actions");
  const { user, isAuthenticated, loading, accessToken, hydrated, error } =
    useAppSelector((state) => state.auth);
  const [pseudonym, setPseudonym] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated && !accessToken) {
      router.push("/login");
    } else if (!user && accessToken) {
      dispatch(getCurrentUser());
    }
  }, [hydrated, isAuthenticated, user, accessToken, dispatch, router]);

  useEffect(() => {
    if (!user) return;
    setPseudonym(user.pseudonym || "");
    setBio(user.bio || "");
  }, [user]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);
    const result = await dispatch(
      updateCurrentProfile({ pseudonym: pseudonym.trim(), bio }),
    );
    if (updateCurrentProfile.fulfilled.match(result)) {
      setSaved(true);
    }
  };

  if (!hydrated || (loading && !user)) {
    return (
      <PageFrame>
        <p className="mt-16 text-center">{t("loading")}</p>
      </PageFrame>
    );
  }

  if (!user) {
    return (
      <PageFrame>
        <p className="mt-16 text-center">{t("notLoggedIn")}</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <form
        className="mx-auto mt-16 max-w-md rounded-xl border border-cyan-500 bg-gray-900 p-6"
        onSubmit={handleSave}
      >
        <h2 className="mb-4 text-2xl font-bold text-cyan-400">{t("profile")}</h2>
        <p className="mb-3 text-pink-400">
          {t("email")}: <span className="text-cyan-200">{user.email}</span>
        </p>
        <p className="mb-3 text-pink-400">
          {t("roles")}: <span className="text-cyan-200">{user.roles?.join(", ")}</span>
        </p>
        <label className="text-sm text-pink-400">{t("pseudonym")}</label>
        <input
          className={inputClass}
          value={pseudonym}
          onChange={(e) => setPseudonym(e.target.value)}
          minLength={3}
          required
        />
        <label className="text-sm text-pink-400">{t("bio")}</label>
        <textarea
          className={inputClass}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        {error && <p className="mb-3 text-red-400">{error}</p>}
        {saved && <p className="mb-3 text-cyan-300">{t("saved")}</p>}
        <button className={`${primaryBtnClass} w-full`} type="submit" disabled={loading}>
          {ta("save")}
        </button>
        <button
          type="button"
          className={`${dangerBtnClass} mt-3 w-full`}
          onClick={() => {
            dispatch(logout());
            router.push("/login");
          }}
        >
          {t("logout")}
        </button>
      </form>
    </PageFrame>
  );
}
