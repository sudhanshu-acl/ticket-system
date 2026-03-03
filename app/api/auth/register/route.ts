// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/user';
import { logger } from '@/app/lib/logger';

export async function POST(request: Request) {
  try {
    const { name, email, password, role = 'user', jobTitle } = await request.json();

    logger.info('[REGISTER] Registration attempt', { email, name });

    if (!name || !email || !password) {
      logger.warn('[REGISTER] Missing required fields', { email, hasName: !!name, hasPassword: !!password });
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      logger.warn('[REGISTER] User already exists', { email });
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password.toString(), 10);
    logger.debug('[REGISTER] Password hashed', { email });

    const newUser = await User.create({ name, email, password: hashed, role, jobTitle });
    logger.info('[REGISTER] User created in database', { email, userId: newUser._id });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'change-me',
      { expiresIn: '7d' }
    );
    logger.debug('[REGISTER] JWT token signed', { email });

    const response = NextResponse.json(
      {
        message: 'User registered',
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, jobTitle: newUser.jobTitle },
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    logger.auth('REGISTER', email, true);
    return response;
  } catch (err: any) {
    logger.error('[REGISTER] Registration failed', { error: err.message, stack: err.stack });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}