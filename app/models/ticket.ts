// models/User.ts
import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],  
    default: 'Open',
    required: true,
  },
  reportedBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now }, 
});

export default mongoose.models.Ticket ||
  mongoose.model('Ticket', TicketSchema);