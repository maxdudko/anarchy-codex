"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser, clearError } from "@/store/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
      setLocalError("Passwords don't match");
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

  return (
    <form
      className="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl mb-4">Register</h2>
      <label htmlFor="email">Email*</label>
      <input
        className="block w-full mb-2 p-2 rounded border"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
      />
      <label htmlFor="pseudonym">Pseudonym*</label>
      <input
        className="block w-full mb-2 p-2 rounded border"
        type="text"
        placeholder="Pseudonym"
        value={form.pseudonym}
        onChange={(e) => setForm((f) => ({ ...f, pseudonym: e.target.value }))}
        required
      />
      <label htmlFor="password">Password*</label>
      <input
        className="block w-full mb-2 p-2 rounded border"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        required
      />
      <label htmlFor="passwordConfirm">Confirm Password*</label>
      <input
        className="block w-full mb-2 p-2 rounded border"
        type="password"
        placeholder="Confirm Password"
        value={form.passwordConfirm}
        onChange={(e) => setForm((f) => ({ ...f, passwordConfirm: e.target.value }))}
        required
      />
      <label htmlFor="bio">Bio</label>
      <textarea
        className="block w-full mb-2 p-2 rounded border"
        placeholder="Bio"
        value={form.bio}
        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
      />
      {localError && <div className="text-red-500 mb-2">{localError}</div>}
      <button
        className="w-full bg-cyan-600 text-white p-2 rounded cursor-pointer"
        type="submit"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <div className="mt-2 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-cyan-400">
          Login
        </Link>
      </div>
    </form>
  );
}
