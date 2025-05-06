import { Link } from 'react-router-dom';
import InputField from '../components/ui/InputField';
import { FormEvent, useRef } from 'react';
import { signup } from '../services/AuthService';
import { AxiosError } from 'axios';

export default function SignUp() {
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userName = userNameRef.current?.value;
    const password = passwordRef.current?.value;

    if (userName && password) {
      try {
        const res = await signup({ userName, password });
        console.log(res);
      } catch (error) {
        const err = error as AxiosError;
        throw new Error(err.message);
      }
    }
  };

  console.log(userNameRef, passwordRef);
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
            className="w-full cursor-pointer rounded-lg bg-[#463ad6] py-2 font-semibold text-white transition hover:opacity-90"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have have an account?{' '}
          <Link to="/signin" className="text-[#463ad6] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
