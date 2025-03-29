"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import UserMenu from "./components/UserMenu";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

function Header() {
  const { user, loading } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                TripVista
              </span>
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="/trips" className="text-gray-600 hover:text-gray-900">
                My Trips
              </a>
              <a href="/explore" className="text-gray-600 hover:text-gray-900">
                Explore
              </a>
              <a href="/calendar" className="text-gray-600 hover:text-gray-900">
                Calendar
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-4 py-2 text-gray-600 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="hidden md:block px-4 py-2 text-gray-600 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
            {loading ? (
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : user ? (
              <div className="ml-2">
                <UserMenu user={user} />
              </div>
            ) : (
              <a
                href="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
          <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-24">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    About TripVista
                  </h3>
                  <p className="text-sm text-gray-600">
                    Professional trip planning and organization tool for modern
                    travelers.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Features
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li>Trip Planning</li>
                    <li>Activity Management</li>
                    <li>Travel Calendar</li>
                    <li>Destination Guides</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Resources
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li>Help Center</li>
                    <li>Travel Blog</li>
                    <li>Community</li>
                    <li>API Documentation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Legal
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Cookie Policy</li>
                    <li>GDPR Compliance</li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  © 2024 TripVista. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
