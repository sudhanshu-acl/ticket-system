// app/api/ticket/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Ticket from '@/app/models/ticket';
import User from '@/app/models/user';
import jwt from 'jsonwebtoken';

const verifyAuth = async (request: NextRequest) => {
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

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { status, resolvedBy } = await request.json();
    console.log("status ", status, resolvedBy);

    // In newer Next.js (15+), `params` is a Promise, so we must await it before destructuring.
    const resolvedParams = await params;
    const ticketId = resolvedParams.id;
    console.log('params ', ticketId);

    if (!status) {
        return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    try {
        await connectDB();

        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketId,
            { $set: { status, resolvedBy } },
            { new: true }
        );

        console.log("updateticket ", updatedTicket);

        if (!updatedTicket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Ticket updated successfully', data: updatedTicket });
    } catch (error) {
        console.error('Error updating ticket:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
