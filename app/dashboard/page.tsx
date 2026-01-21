import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { DeleteAccountButton } from "./delete-account-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome, {data.user.email}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-lg font-medium">User Info</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Email</dt>
              <dd>{data.user.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">User ID</dt>
              <dd className="font-mono text-xs">{data.user.id}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Last Sign In</dt>
              <dd>
                {data.user.last_sign_in_at
                  ? new Date(data.user.last_sign_in_at).toLocaleString()
                  : "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-3">
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Sign out
            </button>
          </form>

          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
