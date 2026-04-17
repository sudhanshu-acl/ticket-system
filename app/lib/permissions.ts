// import type { UserRole } from '@/app/utils/type';\n\ntype UserRole = 'user' | 'support' | 'manager' | 'admin';\n\nexport const hasPermission = (userRole: UserRole | null | undefined, requiredRole: UserRole): boolean => {

import { UserRole } from "../utils/type";

export const hasPermission = (userRole: UserRole | string | null | undefined, requiredPermissionOrRole: string, userPermissions?: string[]): boolean => {
  if (!userRole) return false;
  
  // Super Admin Always Wins
  const adminCodes = ['admin', 'ADMIN_', 'ADMIN_ROLE'];
  if (adminCodes.includes(userRole as string)) {
    return true;
  }

  // 1. Dynamic Database RBAC Validation
  if (userPermissions && userPermissions.includes(requiredPermissionOrRole)) {
     return true;
  }

  // 2. Legacy hierarchy fallback for old string tests
  const hierarchy: string[] = ['user', 'support', 'manager', 'admin'];
  const userIdx = hierarchy.indexOf(userRole as string);
  const reqIdx = hierarchy.indexOf(requiredPermissionOrRole as string);
  
  if (userIdx !== -1 && reqIdx !== -1) {
    return userIdx >= reqIdx;
  }
  
  // 3. Strict exact match for single-layer dynamic string roles without permissions
  return userRole === requiredPermissionOrRole;
}; // eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requirePermission = (user: any | null | undefined, requiredPermissionOrRole: string, errorMsg = `Requires ${requiredPermissionOrRole} permission`): void => {
  if (!user) {
    throw new Error(errorMsg);
  }
  
  const role = typeof user === 'string' ? user : (user.role || null);
  const perms = typeof user === 'object' ? user.rolePermissions : [];

  if (!hasPermission(role, requiredPermissionOrRole, perms)) {
    throw new Error(errorMsg);
  }
};

// Usage: const user = await verifyAuth(req); requirePermission(user?.role, 'manager');

