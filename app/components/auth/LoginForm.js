"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ success: true, message: "Please wait..." });

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        setIsLoading(false);
        setStatus(
          res.error === "CredentialsSignin"
            ? { success: false, message: "Invalid credentials" }
            : { success: false, message: "Something went wrong." }
        );
        return;
      }

      setStatus({ success: true, message: "Login successful! Please wait..." });

      // Fetch the updated session to get the user's role
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      // if (!session || !session.user) {
      //   router.push("/");
      //   return;
      // }

      if (session?.user?.role === "Admin") {
        router.push("/admin");
        return;
      }

      // if (session.user.dept) {
      //   router.push(`/${session.user.dept}`);
      //   return;
      // }

      router.push("/");
    } catch (error) {
      console.error("Error in login:", error);
      setStatus({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center p-8 z-10">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-indigo-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-500 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {status.message && (
          <p
            className={`mt-4 text-center text-sm ${
              status.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm">
          {`Don't have an account?`}{" "}
          <a href="#" className="text-indigo-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
