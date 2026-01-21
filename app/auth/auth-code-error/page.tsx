import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            The confirmation link is invalid or has expired.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to sign in
          </Link>
          <Link
            href="/auth/signup"
            className="block text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Create a new account
          </Link>
        </div>
      </div>
    </div>
  );
}
