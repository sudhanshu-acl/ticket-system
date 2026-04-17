/*
* Role model for storing role information
*/

import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
    name: string;
    description: string;
    permissions: string[];
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new Schema<IRole>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    permissions: {
        type: [String],
        default: [],
    },
    isSystem: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default model<IRole>('Role', roleSchema);
