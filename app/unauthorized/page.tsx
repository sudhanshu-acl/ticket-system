'use client';

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <div>
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100">
            <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 40l14-28m2 28l14-28M8 40h32" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 text-center">Access Denied</h1>
          <p className="mt-2 text-lg text-gray-600 text-center">
            Insufficient permissions for this area.
          </p>
          {user && (
            <p className="mt-2 text-sm text-gray-500 text-center">
              Your role: <span className="font-semibold capitalize text-gray-900">{user.role}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            Back to Tickets
          </Link>
          <Link
            href="/contact"
            className="inline-flex justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 text-center"
          >
            Contact Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
