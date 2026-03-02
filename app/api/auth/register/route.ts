// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/user';

export async function POST(request: Request) {
 
  try {
    const { name, email, password, role = 'user', jobTitle } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
   
    const hashed = await bcrypt.hash(password.toString(), 10);

    const newUser = await User.create({ name, email, password: hashed, role, jobTitle });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'change-me',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ message: 'User registered', user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, jobTitle: newUser.jobTitle } }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}