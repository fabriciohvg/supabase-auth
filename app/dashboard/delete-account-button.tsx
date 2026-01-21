"use client";

import { useState } from "react";
import { deleteAccount } from "@/app/actions/auth";

export function DeleteAccountButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    await deleteAccount();
    setPending(false);
  }

  if (!showConfirm) {
    return (
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Delete account
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
      <p className="text-sm text-red-800 dark:text-red-200">
        Are you sure? This action is irreversible. All your data will be
        permanently deleted.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          disabled={pending}
          className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {pending ? "Deleting..." : "Yes, delete"}
        </button>
      </div>
    </div>
  );
}
