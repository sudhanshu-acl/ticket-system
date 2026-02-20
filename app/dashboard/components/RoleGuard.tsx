'use client';

import { UserRole } from '@/app/utils/type';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  currentRole: UserRole;
}

export default function RoleGuard({ children, allowedRoles, currentRole }: RoleGuardProps) {
  if (!allowedRoles.includes(currentRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Access Denied
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
