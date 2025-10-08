import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import InputField from "../components/ui/InputField";
import { signup } from "../services/api/auth.api";
import { useAuth } from "../hooks/useAuth";
import { AxiosError } from "axios";

export default function SignUp() {
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { loginValidation } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userName = userNameRef.current?.value?.trim();
    const password = passwordRef.current?.value;

    setIsLoading(true);

    try {
      const res = await signup({ userName: userName!, password: password! });

      if (!res.ok) {
        // 🧠 Handle backend-structured validation & duplicate errors
        const backendMsg =
          res.message ||
          (Array.isArray(res.error) ? res.error.join(", ") : "Signup failed.");
        toast.error(backendMsg, { position: "bottom-right" });
        return;
      }

      // ✅ Automatically log in user after successful signup
      const valid = loginValidation(res);
      if (valid.ok) {
        toast.success("Account created successfully!", {
          position: "bottom-right",
        });
        navigate("/dashboard");
      } else {
        toast.error(valid.message || "Something went wrong.", {
          position: "bottom-right",
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const backendData = error.response?.data;
        const backendMsg =
          backendData?.message ||
          (backendData?.error && backendData.error.join(", ")) ||
          "Unexpected signup error.";
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">Sign Up</h2>

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
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-purple-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
