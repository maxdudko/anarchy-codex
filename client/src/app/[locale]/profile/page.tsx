"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, getCurrentUser } from "@/store/slices/authSlice";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!user) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, dispatch, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded shadow">
      <h2 className="text-2xl mb-4">Profile</h2>
      <div>Email: {user.email}</div>
      <div>Pseudonym: {user.pseudonym}</div>
      <div>Roles: {user.roles?.join(", ")}</div>
      <div>Bio: {user.bio}</div>
      <button
        className="mt-4 bg-red-600 text-white p-2 rounded cursor-pointer"
        onClick={() => {
          dispatch(logout());
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
