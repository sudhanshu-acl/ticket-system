// app/api/ticket/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Ticket from '@/app/models/ticket';
import jwt from 'jsonwebtoken';

const verifyAuth = (request: NextRequest) => {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'change-me');
  } catch (err) {
    return null;
  }
};

export async function POST(request: NextRequest) {
  const user = verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, category, priority, status, reportedBy, createdAt } = await request.json();
  await connectDB();

  // create ticket in db here
  const newTicket = await Ticket.create({
    title, category, priority, status, reportedBy: {
      name: reportedBy.name,
      email: reportedBy.email,
      department: reportedBy.department,
    }, createdAt
  });

  return NextResponse.json({ message: 'Ticket created successful', data: newTicket });
}

export async function GET(request: NextRequest) {
  const user = verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  // fetch tickets from db here
  const tickets = await Ticket.find().sort({ createdAt: -1 }).limit(20);

  return NextResponse.json({ message: 'Ticket fetched successful', data: tickets });
}