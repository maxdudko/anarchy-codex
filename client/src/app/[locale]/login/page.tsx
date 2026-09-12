"use client";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
    <form
      className="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl mb-4">Login</h2>
      <label htmlFor="email">Email</label>
      <input
        className="block w-full mb-2 p-2 rounded border"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
      />
      <label htmlFor="password">Password</label>
      <input
        className="block w-full mb-2 p-2 rounded border"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        required
      />
      {localError && <div className="text-red-500 mb-2">{localError}</div>}
      <button
        className="w-full bg-cyan-600 text-white p-2 rounded cursor-pointer"
        type="submit"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="mt-2 text-sm">
        No account?{" "}
        <Link href="/register" className="text-cyan-400">
          Register
        </Link>
      </div>
    </form>
  );
}
