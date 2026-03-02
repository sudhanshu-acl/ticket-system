// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Ticket from '@/app/models/ticket';

export async function POST(request: Request) {

  const { title, category, priority, status, reportedBy, createdAt } = await request.json();
  await connectDB();

  // creat ticket in db here
  const newTicket = await Ticket.create({ title, category, priority, status, reportedBy:{
      name: reportedBy.name,
      email: reportedBy.email,
      department: reportedBy.department,
  }, createdAt });
   
  const response = NextResponse.json({ message: 'Ticket created successful', data: newTicket });

  return response;
}

export async function GET(request: Request) {

  await connectDB();

  // creat ticket in db here
  const newTicket =  await Ticket.find().sort({ createdAt: -1 }).limit(20);
   
  const response = NextResponse.json({ message: 'Ticket fetched successful', data: newTicket });

  return response;
}