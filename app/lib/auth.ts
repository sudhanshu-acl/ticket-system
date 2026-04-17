import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/user';
import mongoose from 'mongoose';

export const verifyAuth = async (request: NextRequest) => {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me') as any;
        await connectDB();
        const user = await User.findById(decoded.userId).select('-password').lean();

        console.log("user", user)

        if (user && user.role) {
            const role = await mongoose.models.Role?.findOne({ code: user.role });
            user.rolePermissions = role?.permissions || [];
        }

        return user;
    } catch (err) {
        return null;
    }
};
