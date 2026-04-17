// models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    default: 'user',
  },
  jobTitle: { type: String },
});

export default mongoose.models.User ||
  mongoose.model('User', UserSchema);