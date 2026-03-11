import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/user';

export const verifyAuth = async (request: NextRequest) => {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me') as any;
        await connectDB();
        const user = await User.findById(decoded.userId);
        return user;
    } catch (err) {
        return null;
    }
};
