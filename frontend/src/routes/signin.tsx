import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import InputField from "../components/ui/InputField";
import { signin } from "../services/api/auth.api";
import { useAuth } from "../hooks/useAuth";
import { AxiosError } from "axios";

export default function SignIn() {
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { isTokenValid, loginValidation } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userName = userNameRef.current?.value?.trim();
    const password = passwordRef.current?.value;

    setIsLoading(true);

    try {
      const res = await signin({ userName: userName!, password: password! });

      // ✅ Backend response shape: { ok, message, accessToken?, refreshToken? }
      if (!res.ok) {
        toast.error(res.message || "Invalid credentials.", {
          position: "bottom-right",
        });
        return;
      }

      const valid = loginValidation(res);
      if (valid.ok) {
        toast.success("Signed in successfully!", { position: "bottom-right" });
        navigate("/dashboard");
      } else {
        toast.error(valid.message || "Something went wrong.", {
          position: "bottom-right",
        });
      }
    } catch (error: unknown) {
      // 🔥 Backend Error Handling in sync with Express API
      if (error instanceof AxiosError) {
        const backendData = error.response?.data;
        const backendMsg =
          backendData?.message ||
          (backendData?.error && backendData.error.join(", ")) ||
          "Unexpected sign-in error.";

        toast.error(backendMsg, { position: "bottom-right" });
      } else {
        toast.error("Network or unknown error occurred.", {
          position: "bottom-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Redirect if already logged in
  if (isTokenValid) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">Sign In</h2>

        <form className="space-y-4" onSubmit={onSubmit}>
          <InputField
            labelName="Username"
            type="text"
            nameAttr="username"
            placeholder="Your username"
            ref={userNameRef}
            required
          />
          <InputField
            labelName="Password"
            type="password"
            nameAttr="password"
            placeholder="Your password"
            ref={passwordRef}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-purple-600 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
