"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, User } from "../lib/auth";
import UserMenu from "./components/UserMenu";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      const { user } = await getCurrentUser();
      setUser(user);
    };
    init();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Trip Viewer</h1>
          {user && <UserMenu user={user} />}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
