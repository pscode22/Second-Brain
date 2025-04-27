import { Link } from 'react-router-dom';
import InputField from '../components/ui/InputField';

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">Sign In</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log(e);
          }}
        >
          <InputField
            labelName="Username"
            type="text"
            nameAttr="username"
            placeholder="Your username"
          />
          <InputField
            labelName="Password"
            type="password"
            nameAttr="password"
            placeholder="Your password"
          />
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-purple-600 py-2 font-semibold text-white transition hover:opacity-90"
            onClick={(e) => e.preventDefault()}
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
