import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/ui/InputField';
import { FormEvent, useEffect, useRef } from 'react';
import { signin } from '../services/api/auth.api';
import { useAuth } from '../hooks/useAuth';
import { GenericResponse, LoginOkRes } from '../interfaces/generic';

const { log } = console;

export default function SignIn() {
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { isTokenValid } = useAuth();

  const { loginValidation } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userName = userNameRef.current?.value;
    const password = passwordRef.current?.value;

    if (userName && password) {
      console.log({ userName, password });
      try {
        const res: LoginOkRes = await signin({ userName, password });

        if (res && res.ok) {
          const valid = (await loginValidation(res)) as GenericResponse;

          if (valid.ok) navigate('/dashboard');
          if (!valid.ok) {
            throw new Error(valid.message);
          }
        }
      } catch (error) {
        log(error);
      }
    }
  };

  // navigate user to dashboard if already validated.
  useEffect(() => {
    if (isTokenValid) {
      navigate('/dashboard');
    }
  }, [isTokenValid, navigate]);

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
            className="w-full cursor-pointer rounded-lg bg-purple-600 py-2 font-semibold text-white transition hover:opacity-90"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-purple-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
