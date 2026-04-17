// app/models/category.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    code: string;
    description: string;
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    isSystem: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
