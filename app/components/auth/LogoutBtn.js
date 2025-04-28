"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const LogoutBtn = () => {
  const router = useRouter();
  async function handleLogout() {
    try {
      const result = await signOut({ redirect: false });

      if (result.error) {
        console.error("Sign-out error:", result.error);
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <button
      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
