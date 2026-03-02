// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  await connectDB();

  const response = NextResponse.json({ message: 'Ticket fetched successful', data: [], });

  return response;
}