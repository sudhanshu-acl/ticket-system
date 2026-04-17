// app/models/permission.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
    name: string;
    code: string;
    description: string;
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>({
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

export default mongoose.models.Permission || mongoose.model<IPermission>('Permission', permissionSchema);
