// models/User.ts
import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

export default mongoose.models.Ticket ||
  mongoose.model('Ticket', TicketSchema);