import React from 'react';
import { Outlet, Link } from 'react-router-dom';

/**
 * Layout for authentication pages (login, register, forgot-password, verify-email).
 * No sidebar – just a centered card with a logo header.
 */
const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple top bar with logo */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6">
        <Link to="/" className="text-xl font-bold text-blue-600 no-underline">
          RecruitPro
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
