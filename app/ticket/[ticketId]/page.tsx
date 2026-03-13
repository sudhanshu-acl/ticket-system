import { sampleTickets } from "@/app/data/tickets";
import type { Metadata } from 'next'

// Add the metadata export for SEO and page info
export const metadata: Metadata = {
  title: 'Ticket Details',
  description: 'Details of a specific ticket',
}

// 1️⃣ Static generation at build time
export async function generateStaticParams() {
  return sampleTickets.map((ticket) => ({
    ticketId: ticket._id,
  }));
}

export default function TicketDetailPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const ticket = sampleTickets.find(
    (t: any) => t.ticketId === params.ticketId
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ticket Details</h1>
      <p><strong>ID:</strong> {ticket?._id}</p>
      <p><strong>Title:</strong> {ticket?.title}</p>
      <p><strong>Category:</strong> {ticket?.category}</p>
      <p><strong>Priority:</strong> {ticket?.priority}</p>
      <p><strong>Status:</strong> {ticket?.status}</p>
    </div>
  );
}
