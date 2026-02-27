export type pagePropsChildNode = {
    children: React.ReactNode;
}

export type UserRole = 'admin' | 'user' | 'support';

export interface BlogPost {
    userId?: number;
    id: number;
    title: string;
    body: string;
}

export interface User {
    id: number;
    username: string;
    email?: string;
    role?: UserRole;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user?: User;
}