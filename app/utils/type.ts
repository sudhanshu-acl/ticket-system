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
    id: string | number;
    name?: string;
    email: string;
    role?: UserRole;
    jobTitle?: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    jobTitle?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user?: User;
}