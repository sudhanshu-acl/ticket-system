export type pagePropsChildNode = {
    children: React.ReactNode;
}

// Role types for dashboard
export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
}

// Dashboard stats interface
export interface DashboardStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
}
