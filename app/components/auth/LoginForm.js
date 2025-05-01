"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/app/actions/userActions";

const LoginForm = ({ isSignup, depts }) => {
  const router = useRouter();
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  // const [dept, setDept] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // if (isSignup && !dept.trim()) {
    //   newErrors.dept = "Department is required";
    // }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleLogin(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatus({ success: true, message: "Please wait..." });

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        setStatus(
          res.error === "CredentialsSignin"
            ? { success: false, message: "Invalid credentials" }
            : { success: false, message: "Something went wrong." }
        );
        return;
      }

      setStatus({ success: true, message: "Login successful! Please wait..." });

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

  async function handleRegister(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatus({ success: true, message: "Please wait..." });

    const formData = {
      name: "Guest Viewer", // You can extend this to accept name input
      email,
      password,
      dept: "Any",
      role: "Guest Admin",
    };

    try {
      const res = await registerUser(formData);

      setStatus(res);
    } catch (error) {
      console.error("Error in registration:", error);
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
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          {isSignup ? "Sign Up" : "Welcome Back"}
        </h2>

        <form
          onSubmit={isSignup ? handleRegister : handleLogin}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* {isSignup && (
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Department
              </label>
              <select
                name="dept"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Department</option>
                {depts.map((dept) => (
                  <option key={dept._id} value={dept.deptName}>
                    {dept.deptName}
                  </option>
                ))}
              </select>
              {errors.dept && (
                <p className="text-sm text-red-600 mt-1">{errors.dept}</p>
              )}
            </div>
          )} */}

          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-sm text-blue-600 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {!isSignup && (
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="accent-indigo-500"
                  disabled={isLoading}
                />
                <span>Remember me</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {isLoading
              ? isSignup
                ? "Creating account..."
                : "Signing In..."
              : isSignup
              ? "Create Account"
              : "Sign In"}
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
          {isSignup ? (
            <>
              Already registered? Please
              <Link
                href="?mode=signin"
                className="text-indigo-500 pl-1.5 hover:underline"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?
              <Link
                href="?mode=signup"
                className="text-indigo-500 pl-1.5 hover:underline"
              >
                Sign Up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
