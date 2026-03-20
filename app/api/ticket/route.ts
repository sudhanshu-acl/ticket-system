// app/api/ticket/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Ticket from '@/app/models/ticket';
import { verifyAuth } from '@/app/lib/auth';
import { requirePermission } from '@/app/lib/permissions';

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  requirePermission(user.role, 'user');

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
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  requirePermission(user.role, 'user');

  await connectDB();

  let query = {};
  if (['user', 'support'].includes(user.role)) {
    query = { "reportedBy.email": user.email };
  }
  // manager and admin see all tickets

  // fetch tickets from db here
  const tickets = await Ticket.find(query).sort({ createdAt: -1 }).limit(20);

  return NextResponse.json({ message: 'Ticket fetched successful', data: tickets });
}
