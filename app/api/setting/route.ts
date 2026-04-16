// app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/user';
import { logger } from '@/app/lib/logger';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        logger.info('[LOGIN] Login attempt', { email });

        await connectDB();
        logger.debug('[LOGIN] Connected to database', { email });

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('[LOGIN] User not found', { email });
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password.toString(), user.password);
        if (!isMatch) {
            logger.warn('[LOGIN] Password mismatch', { email });
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'change-me',
            { expiresIn: '7d' }
        );
        logger.debug('[LOGIN] JWT token generated', { email });

        const response = NextResponse.json({
            message: 'Login successful',
            data: {
                token: token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role, jobTitle: user.jobTitle },
            },
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        logger.auth('LOGIN', email, true);
        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        logger.error('[LOGIN] Login failed', { error: err.message });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}