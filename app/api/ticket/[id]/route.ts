// app/api/ticket/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Ticket from '@/app/models/ticket';
import { verifyAuth } from '@/app/lib/auth';
import { requirePermission } from '@/app/lib/permissions';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    requirePermission(user.role, 'manager');

    const { status, resolvedBy, assignedTo } = await request.json();
    console.log("status ", status, resolvedBy, assignedTo);

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
            { $set: { status, resolvedBy, assignedTo } },
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
