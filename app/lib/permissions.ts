// import type { UserRole } from '@/app/utils/type';\n\ntype UserRole = 'user' | 'support' | 'manager' | 'admin';\n\nexport const hasPermission = (userRole: UserRole | null | undefined, requiredRole: UserRole): boolean => {

import { UserRole } from "../utils/type";

export const hasPermission = (userRole: UserRole | null | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  const hierarchy: UserRole[] = ['user', 'support', 'manager', 'admin'];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole);
};

export const requirePermission = (userRole: UserRole | null | undefined, requiredRole: UserRole, errorMsg = `Requires ${requiredRole} role`): void => {
  if (!hasPermission(userRole, requiredRole)) {
    throw new Error(errorMsg);
  }
};

// Usage: const user = await verifyAuth(req); requirePermission(user?.role, 'manager');

