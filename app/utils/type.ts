export type pagePropsChildNode = {
    children: React.ReactNode;
}

export type UserRole = string;

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
    rolePermissions?: string[];
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

export interface Role {
    _id: string;
    name: string;
    code: string;
    description: string;
    permissions: string[];
    isSystem?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Permission {
    _id: string;
    name: string;
    code: string;
    description: string;
    isSystem?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Category {
    _id: string;
    name: string;
    code: string;
    description: string;
    isSystem?: boolean;
    createdAt?: string;
    updatedAt?: string;
}